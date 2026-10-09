import crypto from 'crypto';
import { z } from 'zod';

export const idempotencyStatusSchema = z.enum(['PROCESSING', 'RESOLVED', 'REJECTED']);
export type IdempotencyStatus = z.infer<typeof idempotencyStatusSchema>;

export interface IdempotencyRecord {
  id: string;
  tenantId: string;
  idempotencyKey: string;
  requestHash: string;
  status: IdempotencyStatus;
  responseCode?: number;
  responseBody?: unknown;
  expiresAt: Date;
  createdAt: Date;
}

export function generateRequestHash(method: string, path: string, body: unknown): string {
  const normalizedPayload = JSON.stringify({
    method: method.toUpperCase(),
    path: path.toLowerCase(),
    body: body ?? {},
  });
  return crypto.createHash('sha256').update(normalizedPayload).digest('hex');
}

export function evaluateIdempotency(
  existing: IdempotencyRecord | null,
  incomingHash: string
): { isReplay: boolean; isConflict: boolean; cachedResponse?: { status: number; body: unknown } } {
  if (!existing) {
    return { isReplay: false, isConflict: false };
  }

  // If incoming payload hash differs from original request hash with the same key
  if (existing.requestHash !== incomingHash) {
    return { isReplay: false, isConflict: true };
  }

  // Same key + same payload: replay
  if (existing.status === 'RESOLVED' && existing.responseCode) {
    return {
      isReplay: true,
      isConflict: false,
      cachedResponse: {
        status: existing.responseCode,
        body: existing.responseBody,
      },
    };
  }

  // Still processing
  return { isReplay: true, isConflict: false };
}
