import { z } from 'zod';

export const bookingUnitSchema = z.enum(['TIME_SLOT', 'DATE_RANGE']);
export type BookingUnit = z.infer<typeof bookingUnitSchema>;

export const serviceSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  resourcePoolId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(255),
  bookingUnit: bookingUnitSchema.default('TIME_SLOT'),
  durationMinutes: z.number().int().positive().default(60),
  bufferBeforeMinutes: z.number().int().nonnegative().default(0),
  bufferAfterMinutes: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Service = z.infer<typeof serviceSchema>;

// Customer model with strict PII boundaries (zero EHR or medical history)
export const customerSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  fullName: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(64).optional(),
  customAttributes: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Customer = z.infer<typeof customerSchema>;
