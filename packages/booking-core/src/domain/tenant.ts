import { z } from 'zod';
import { isValidIanaTimezone } from '../utils/timezone';

export const tenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(255),
  timezone: z.string().refine(isValidIanaTimezone, { message: 'Invalid IANA timezone' }),
  currency: z.string().length(3).regex(/^[A-Z]{3}$/, 'Currency must be 3 uppercase letters'),
  settings: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Tenant = z.infer<typeof tenantSchema>;

export const branchSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  timezone: z.string().refine(isValidIanaTimezone, { message: 'Invalid branch IANA timezone' }),
  address: z.record(z.string(), z.unknown()).default({}),
  settings: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Branch = z.infer<typeof branchSchema>;
