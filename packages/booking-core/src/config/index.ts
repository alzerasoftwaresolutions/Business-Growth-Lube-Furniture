import dotenv from 'dotenv';
import { z } from 'zod';
import { isValidIanaTimezone } from '../utils/timezone';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/alzer_booking_core'),
  DB_POOL_MAX: z.coerce.number().default(20),
  DEFAULT_TIMEZONE: z.string().refine(isValidIanaTimezone, {
    message: 'Invalid default IANA timezone',
  }).default('UTC'),
  REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type AppConfig = z.infer<typeof configSchema>;

export const config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_POOL_MAX: process.env.DB_POOL_MAX,
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE,
  REDIS_URL: process.env.REDIS_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
});
