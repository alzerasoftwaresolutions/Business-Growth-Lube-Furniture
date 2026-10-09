import { describe, it, expect } from 'vitest';
import { serviceSchema, customerSchema } from '../domain/service';

describe('Domain - Service & Customer', () => {
  it('validates a TIME_SLOT service with duration and buffers', () => {
    const service = serviceSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      name: 'Interior Architecture Consultation',
      bookingUnit: 'TIME_SLOT',
      durationMinutes: 90,
      bufferBeforeMinutes: 10,
      bufferAfterMinutes: 15,
    });

    expect(service.bookingUnit).toBe('TIME_SLOT');
    expect(service.durationMinutes).toBe(90);
    expect(service.bufferBeforeMinutes).toBe(10);
  });

  it('validates a DATE_RANGE lodging service', () => {
    const service = serviceSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      name: 'Penthouse Villa Overnight Stay',
      bookingUnit: 'DATE_RANGE',
      durationMinutes: 1440,
    });

    expect(service.bookingUnit).toBe('DATE_RANGE');
  });

  it('validates customer without sensitive medical or EHR attributes', () => {
    const customer = customerSchema.parse({
      id: crypto.randomUUID(),
      tenantId: crypto.randomUUID(),
      fullName: 'Abebe Bikila',
      email: 'abebe@example.com',
      phone: '+251911223344',
      customAttributes: { preferredWood: 'Teak', inquirySource: 'Website' },
    });

    expect(customer.fullName).toBe('Abebe Bikila');
    expect(customer.customAttributes).toEqual({ preferredWood: 'Teak', inquirySource: 'Website' });
  });

  it('rejects an invalid customer email address', () => {
    expect(() => {
      customerSchema.parse({
        id: crypto.randomUUID(),
        tenantId: crypto.randomUUID(),
        fullName: 'Jane Doe',
        email: 'not-an-email',
      });
    }).toThrow();
  });
});
