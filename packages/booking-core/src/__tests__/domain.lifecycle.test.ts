import { describe, it, expect } from 'vitest';
import {
  canTransitionReservation,
  applyReschedule,
  reservationStatusSchema,
  Reservation,
} from '../domain/reservation';

describe('Domain - Reservation Lifecycle & Rescheduling', () => {
  it('allows valid lifecycle transitions by authorized actors', () => {
    expect(canTransitionReservation('DRAFT', 'PENDING', 'CUSTOMER')).toBe(true);
    expect(canTransitionReservation('PENDING', 'CONFIRMED', 'SYSTEM')).toBe(true);
    expect(canTransitionReservation('PENDING', 'CANCELLED', 'CUSTOMER')).toBe(true);
    expect(canTransitionReservation('CONFIRMED', 'CHECKED_IN', 'STAFF')).toBe(true);
    expect(canTransitionReservation('CHECKED_IN', 'COMPLETED', 'STAFF')).toBe(true);
    expect(canTransitionReservation('CONFIRMED', 'CANCELLED', 'CUSTOMER')).toBe(true);
    expect(canTransitionReservation('CONFIRMED', 'NO_SHOW', 'STAFF')).toBe(true);
  });

  it('rejects forbidden transitions', () => {
    expect(canTransitionReservation('CANCELLED', 'CONFIRMED', 'ADMIN')).toBe(false);
    expect(canTransitionReservation('COMPLETED', 'PENDING', 'ADMIN')).toBe(false);
    expect(canTransitionReservation('CHECKED_IN', 'PENDING', 'CUSTOMER')).toBe(false);
    expect(canTransitionReservation('NO_SHOW', 'CONFIRMED', 'STAFF')).toBe(false);
    expect(canTransitionReservation('CONFIRMED', 'COMPLETED', 'CUSTOMER')).toBe(false);
  });

  it('does NOT contain RESCHEDULED in the reservation status enum', () => {
    const statuses = reservationStatusSchema.options;
    expect(statuses).not.toContain('RESCHEDULED');
  });

  it('performs atomic rescheduling: keeps CONFIRMED status and increments version', () => {
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      confirmationCode: 'LUB-10293',
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      serviceId: crypto.randomUUID(),
      resourceId: crypto.randomUUID(),
      resourcePoolId: null,
      bookingUnit: 'TIME_SLOT',
      startDateTime: new Date('2026-10-12T10:00:00Z'),
      endDateTime: new Date('2026-10-12T11:00:00Z'),
      checkInDate: null,
      checkOutDate: null,
      partySize: 1,
      status: 'CONFIRMED',
      paymentStatus: 'NOT_REQUIRED',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    const newStart = new Date('2026-10-14T14:00:00Z');
    const newEnd = new Date('2026-10-14T15:00:00Z');

    const { updatedReservation, versionRecord } = applyReschedule(
      reservation,
      { startDateTime: newStart, endDateTime: newEnd },
      'STAFF',
      'Client requested afternoon slot'
    );

    // Operational status MUST remain CONFIRMED
    expect(updatedReservation.status).toBe('CONFIRMED');
    // Version must increment
    expect(updatedReservation.version).toBe(2);
    expect(updatedReservation.startDateTime).toEqual(newStart);
    expect(updatedReservation.endDateTime).toEqual(newEnd);

    // Version record must capture previous and new coordinates
    expect(versionRecord.reservationId).toBe(reservation.id);
    expect(versionRecord.versionNumber).toBe(2);
    expect(versionRecord.action).toBe('RESCHEDULED');
    expect(versionRecord.previousCoordinates.startDateTime).toEqual(reservation.startDateTime);
    expect(versionRecord.newCoordinates.startDateTime).toEqual(newStart);
    expect(versionRecord.reason).toBe('Client requested afternoon slot');
  });

  it('throws an error when attempting to reschedule a CANCELLED reservation', () => {
    const cancelledReservation: Reservation = {
      id: crypto.randomUUID(),
      confirmationCode: 'LUB-99999',
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      serviceId: crypto.randomUUID(),
      bookingUnit: 'TIME_SLOT',
      startDateTime: new Date('2026-10-12T10:00:00Z'),
      endDateTime: new Date('2026-10-12T11:00:00Z'),
      partySize: 1,
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    expect(() => {
      applyReschedule(
        cancelledReservation,
        {
          startDateTime: new Date('2026-10-15T10:00:00Z'),
          endDateTime: new Date('2026-10-15T11:00:00Z'),
        },
        'CUSTOMER'
      );
    }).toThrow(/Cannot reschedule reservation with status "CANCELLED"/);
  });
});
