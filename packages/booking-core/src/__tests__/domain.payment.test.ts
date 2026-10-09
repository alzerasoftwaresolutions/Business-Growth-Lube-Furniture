import { describe, it, expect } from 'vitest';
import { paymentStatusSchema } from '../domain/payment';
import { reservationSchema } from '../domain/reservation';

describe('Domain - Decoupled Payment Lifecycle', () => {
  it('supports all vendor-neutral payment statuses', () => {
    const options = paymentStatusSchema.options;
    expect(options).toEqual([
      'NOT_REQUIRED',
      'PENDING',
      'AUTHORIZED',
      'DEPOSIT_PAID',
      'PAID_IN_FULL',
      'REFUNDED',
      'FAILED',
    ]);
  });

  it('permits valid orthogonal combinations: CONFIRMED with PENDING (Pay on Arrival)', () => {
    const res = reservationSchema.parse({
      id: crypto.randomUUID(),
      confirmationCode: 'POA-1092',
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      serviceId: crypto.randomUUID(),
      bookingUnit: 'TIME_SLOT',
      startDateTime: new Date('2026-10-12T10:00:00Z'),
      endDateTime: new Date('2026-10-12T11:00:00Z'),
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
    });

    expect(res.status).toBe('CONFIRMED');
    expect(res.paymentStatus).toBe('PENDING');
  });

  it('permits valid orthogonal combinations: CANCELLED with REFUNDED', () => {
    const res = reservationSchema.parse({
      id: crypto.randomUUID(),
      confirmationCode: 'REF-8321',
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      serviceId: crypto.randomUUID(),
      bookingUnit: 'TIME_SLOT',
      startDateTime: new Date('2026-10-12T10:00:00Z'),
      endDateTime: new Date('2026-10-12T11:00:00Z'),
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
    });

    expect(res.status).toBe('CANCELLED');
    expect(res.paymentStatus).toBe('REFUNDED');
  });
});
