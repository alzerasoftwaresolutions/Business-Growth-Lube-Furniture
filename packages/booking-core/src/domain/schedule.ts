import { z } from 'zod';

export const scheduleSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  branchId: z.string().uuid(),
  resourceId: z.string().uuid().nullable().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Format HH:MM or HH:MM:SS'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Format HH:MM or HH:MM:SS'),
  isWorking: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
}).refine(data => data.startTime < data.endTime, {
  message: 'startTime must be before endTime',
  path: ['endTime'],
});

export type Schedule = z.infer<typeof scheduleSchema>;

export const scheduleExceptionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  branchId: z.string().uuid(),
  resourceId: z.string().uuid().nullable().optional(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  reason: z.string().min(1).max(255),
  isUnavailable: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
}).refine(data => data.startDateTime < data.endDateTime, {
  message: 'startDateTime must be before endDateTime',
  path: ['endDateTime'],
});

export type ScheduleException = z.infer<typeof scheduleExceptionSchema>;
