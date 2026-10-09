import { describe, it, expect } from 'vitest';
import { createOutboxEvent } from '../domain/outbox';

describe('Domain - Transactional Outbox Foundation', () => {
  it('creates an outbox event with PENDING status and zero retries', () => {
    const tenantId = crypto.randomUUID();
    const aggregateId = crypto.randomUUID();
    const payload = { reservationCode: 'LUB-8924', customerEmail: 'test@example.com' };

    const event = createOutboxEvent(tenantId, 'RESERVATION_CONFIRMED', aggregateId, payload);

    expect(event.tenantId).toBe(tenantId);
    expect(event.eventType).toBe('RESERVATION_CONFIRMED');
    expect(event.aggregateId).toBe(aggregateId);
    expect(event.status).toBe('PENDING');
    expect(event.retryCount).toBe(0);
    expect(event.payload).toEqual(payload);
  });
});
