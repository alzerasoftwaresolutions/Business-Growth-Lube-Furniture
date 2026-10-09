import { z } from 'zod';
import { bookingUnitSchema } from './service';
import { paymentStatusSchema, PaymentStatus } from './payment';
import { isValidIsoDate, calculateNights } from '../utils/timezone';

export const reservationStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'CONFIRMED',
  'CHECKED_IN',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);

export type ReservationStatus = z.infer<typeof reservationStatusSchema>;

export const actorTypeSchema = z.enum(['CUSTOMER', 'STAFF', 'ADMIN', 'SYSTEM']);
export type ActorType = z.infer<typeof actorTypeSchema>;

export const reservationSchema = z.object({
  id: z.string().uuid(),
  confirmationCode: z.string().min(4).max(32),
  tenantId: z.string().uuid(),
  branchId: z.string().uuid(),
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  resourceId: z.string().uuid().nullable().optional(),
  resourcePoolId: z.string().uuid().nullable().optional(),
  bookingUnit: bookingUnitSchema.default('TIME_SLOT'),
  startDateTime: z.date(),
  endDateTime: z.date(),
  checkInDate: z.string().nullable().optional(),
  checkOutDate: z.string().nullable().optional(),
  partySize: z.number().int().positive().default(1),
  status: reservationStatusSchema.default('CONFIRMED'),
  paymentStatus: paymentStatusSchema.default('NOT_REQUIRED'),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  version: z.number().int().positive().default(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
}).refine(data => {
  if (data.bookingUnit === 'TIME_SLOT') {
    return data.startDateTime < data.endDateTime;
  }
  if (data.bookingUnit === 'DATE_RANGE') {
    if (!data.checkInDate || !data.checkOutDate) return false;
    if (!isValidIsoDate(data.checkInDate) || !isValidIsoDate(data.checkOutDate)) return false;
    return calculateNights(data.checkInDate, data.checkOutDate) > 0;
  }
  return true;
}, {
  message: 'Invalid temporal booking coordinates for bookingUnit',
  path: ['endDateTime'],
});

export type Reservation = z.infer<typeof reservationSchema>;

export interface ReservationVersion {
  id: string;
  reservationId: string;
  versionNumber: number;
  actorType: ActorType;
  actorId?: string;
  action: 'CREATED' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'STATUS_CHANGE';
  previousCoordinates: {
    startDateTime?: Date;
    endDateTime?: Date;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    resourceId?: string | null;
    partySize?: number;
  };
  newCoordinates: {
    startDateTime?: Date;
    endDateTime?: Date;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    resourceId?: string | null;
    partySize?: number;
  };
  reason?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface ReservationAuditLog {
  id: string;
  reservationId: string;
  actorType: ActorType;
  actorId?: string;
  action: string;
  previousState?: string;
  newState?: string;
  ipAddress?: string;
  createdAt: Date;
}

// Strict State Transition Matrix
export function canTransitionReservation(
  from: ReservationStatus,
  to: ReservationStatus,
  actor: ActorType
): boolean {
  if (from === to) return false;

  const validTransitions: Record<ReservationStatus, { targets: ReservationStatus[]; allowedActors: ActorType[] }[]> = {
    DRAFT: [
      { targets: ['PENDING'], allowedActors: ['CUSTOMER', 'STAFF', 'ADMIN', 'SYSTEM'] },
      { targets: ['CANCELLED'], allowedActors: ['CUSTOMER', 'STAFF', 'ADMIN', 'SYSTEM'] },
    ],
    PENDING: [
      { targets: ['CONFIRMED'], allowedActors: ['SYSTEM', 'STAFF', 'ADMIN'] },
      { targets: ['CANCELLED'], allowedActors: ['CUSTOMER', 'SYSTEM', 'STAFF', 'ADMIN'] },
    ],
    CONFIRMED: [
      { targets: ['CHECKED_IN'], allowedActors: ['STAFF', 'ADMIN'] },
      { targets: ['CANCELLED'], allowedActors: ['CUSTOMER', 'STAFF', 'ADMIN'] },
      { targets: ['NO_SHOW'], allowedActors: ['STAFF', 'ADMIN'] },
    ],
    CHECKED_IN: [
      { targets: ['COMPLETED'], allowedActors: ['STAFF', 'ADMIN'] },
    ],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  };

  const allowedRules = validTransitions[from] || [];
  return allowedRules.some(
    rule => rule.targets.includes(to) && rule.allowedActors.includes(actor)
  );
}

// Atomic Rescheduling Operation (Preserves status as CONFIRMED, increments version)
export function applyReschedule(
  current: Reservation,
  newCoords: {
    startDateTime: Date;
    endDateTime: Date;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    resourceId?: string | null;
  },
  actor: ActorType,
  reason?: string
): { updatedReservation: Reservation; versionRecord: ReservationVersion } {
  if (!['CONFIRMED', 'PENDING'].includes(current.status)) {
    throw new Error(`Cannot reschedule reservation with status "${current.status}". Only CONFIRMED or PENDING may be rescheduled.`);
  }

  const previousCoordinates = {
    startDateTime: current.startDateTime,
    endDateTime: current.endDateTime,
    checkInDate: current.checkInDate,
    checkOutDate: current.checkOutDate,
    resourceId: current.resourceId,
    partySize: current.partySize,
  };

  const newVersion = current.version + 1;

  const updatedReservation: Reservation = {
    ...current,
    startDateTime: newCoords.startDateTime,
    endDateTime: newCoords.endDateTime,
    checkInDate: newCoords.checkInDate !== undefined ? newCoords.checkInDate : current.checkInDate,
    checkOutDate: newCoords.checkOutDate !== undefined ? newCoords.checkOutDate : current.checkOutDate,
    resourceId: newCoords.resourceId !== undefined ? newCoords.resourceId : current.resourceId,
    version: newVersion,
    updatedAt: new Date(),
  };

  const versionRecord: ReservationVersion = {
    id: crypto.randomUUID(),
    reservationId: current.id,
    versionNumber: newVersion,
    actorType: actor,
    action: 'RESCHEDULED',
    previousCoordinates,
    newCoordinates: {
      startDateTime: updatedReservation.startDateTime,
      endDateTime: updatedReservation.endDateTime,
      checkInDate: updatedReservation.checkInDate,
      checkOutDate: updatedReservation.checkOutDate,
      resourceId: updatedReservation.resourceId,
      partySize: updatedReservation.partySize,
    },
    reason,
    createdAt: new Date(),
  };

  return { updatedReservation, versionRecord };
}
