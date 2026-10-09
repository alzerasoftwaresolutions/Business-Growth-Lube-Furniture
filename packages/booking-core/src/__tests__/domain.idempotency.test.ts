import { describe, it, expect } from 'vitest';
import { generateRequestHash, evaluateIdempotency, IdempotencyRecord } from '../domain/idempotency';

describe('Domain - Idempotency Foundation', () => {
  it('generates deterministic SHA-256 hash for identical requests', () => {
    const hash1 = generateRequestHash('POST', '/v1/public/lube/reservations', { serviceId: 'srv-1', slot: '10:00' });
    const hash2 = generateRequestHash('POST', '/v1/public/lube/reservations', { serviceId: 'srv-1', slot: '10:00' });
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('generates different hashes for different payloads', () => {
    const hash1 = generateRequestHash('POST', '/v1/public/lube/reservations', { serviceId: 'srv-1' });
    const hash2 = generateRequestHash('POST', '/v1/public/lube/reservations', { serviceId: 'srv-2' });
    expect(hash1).not.toBe(hash2);
  });

  it('safely replays resolved response when same key and same payload are provided', () => {
    const payload = { serviceId: 'srv-1', customer: 'Abebe' };
    const hash = generateRequestHash('POST', '/reservations', payload);

    const record: IdempotencyRecord = {
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      idempotencyKey: 'idemp-key-123',
      requestHash: hash,
      status: 'RESOLVED',
      responseCode: 201,
      responseBody: { confirmationCode: 'LUB-4819' },
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
    };

    const evaluation = evaluateIdempotency(record, hash);
    expect(evaluation.isReplay).toBe(true);
    expect(evaluation.isConflict).toBe(false);
    expect(evaluation.cachedResponse?.status).toBe(201);
    expect(evaluation.cachedResponse?.body).toEqual({ confirmationCode: 'LUB-4819' });
  });

  it('detects conflict when same key is submitted with a different payload', () => {
    const originalHash = generateRequestHash('POST', '/reservations', { amount: 100 });
    const alteredHash = generateRequestHash('POST', '/reservations', { amount: 500 }); // Different payload!

    const record: IdempotencyRecord = {
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      idempotencyKey: 'idemp-key-123',
      requestHash: originalHash,
      status: 'RESOLVED',
      responseCode: 201,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
    };

    const evaluation = evaluateIdempotency(record, alteredHash);
    expect(evaluation.isConflict).toBe(true);
    expect(evaluation.isReplay).toBe(false);
  });
});
