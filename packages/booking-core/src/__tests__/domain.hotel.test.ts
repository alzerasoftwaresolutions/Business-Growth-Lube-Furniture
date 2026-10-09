import { describe, it, expect } from 'vitest';
import { calculateNights, isValidIsoDate, doDateRangesOverlap } from '../utils/timezone';
import { reservationSchema } from '../domain/reservation';

describe('Domain - Hotel & Date-Range Lodging Semantics', () => {
  it('correctly calculates 4 nights between 2026-10-10 and 2026-10-14', () => {
    const nights = calculateNights('2026-10-10', '2026-10-14');
    expect(nights).toBe(4);
  });

  it('rejects same-day checkout (0 nights) for overnight lodging', () => {
    const nights = calculateNights('2026-10-10', '2026-10-10');
    expect(nights).toBe(0);
  });

  it('validates ISO date format string helper', () => {
    expect(isValidIsoDate('2026-10-10')).toBe(true);
    expect(isValidIsoDate('2026-02-29')).toBe(false); // 2026 is not a leap year
    expect(isValidIsoDate('invalid-date')).toBe(false);
  });

  describe('Discrete Date-Range Overlap & Same-Day Turnover Semantics', () => {
    it('allows same-day turnover without collision (2026-10-10 to 2026-10-14 and 2026-10-14 to 2026-10-18)', () => {
      // Guest A leaves on Oct 14 at checkout (11:00); Guest B arrives on Oct 14 at check-in (15:00)
      const overlaps = doDateRangesOverlap('2026-10-10', '2026-10-14', '2026-10-14', '2026-10-18');
      expect(overlaps).toBe(false); // NO OVERLAP: Coexistence permitted!
    });

    it('detects and rejects overlapping stays (2026-10-10 to 2026-10-14 and 2026-10-12 to 2026-10-15)', () => {
      const overlaps = doDateRangesOverlap('2026-10-10', '2026-10-14', '2026-10-12', '2026-10-15');
      expect(overlaps).toBe(true); // OVERLAP: Conflict!
    });

    it('detects and rejects contained stays (2026-10-10 to 2026-10-14 and 2026-10-11 to 2026-10-13)', () => {
      const overlaps = doDateRangesOverlap('2026-10-10', '2026-10-14', '2026-10-11', '2026-10-13');
      expect(overlaps).toBe(true);
    });

    it('correctly identifies completely disjoint date ranges', () => {
      const overlaps = doDateRangesOverlap('2026-10-10', '2026-10-14', '2026-10-20', '2026-10-25');
      expect(overlaps).toBe(false);
    });
  });

  it('validates a DATE_RANGE reservation', () => {
    const checkIn = '2026-10-10';
    const checkOut = '2026-10-14';

    const res = reservationSchema.parse({
      id: crypto.randomUUID(),
      confirmationCode: 'HTL-88219',
      tenantId: crypto.randomUUID(),
      branchId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      serviceId: crypto.randomUUID(),
      bookingUnit: 'DATE_RANGE',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      startDateTime: new Date('2026-10-10T15:00:00Z'),
      endDateTime: new Date('2026-10-14T11:00:00Z'),
      partySize: 2,
      status: 'CONFIRMED',
      paymentStatus: 'DEPOSIT_PAID',
    });

    expect(res.bookingUnit).toBe('DATE_RANGE');
    expect(res.checkInDate).toBe('2026-10-10');
    expect(res.checkOutDate).toBe('2026-10-14');
  });

  it('rejects a DATE_RANGE reservation if checkOutDate is before checkInDate', () => {
    expect(() => {
      reservationSchema.parse({
        id: crypto.randomUUID(),
        confirmationCode: 'HTL-INVALID',
        tenantId: crypto.randomUUID(),
        branchId: crypto.randomUUID(),
        customerId: crypto.randomUUID(),
        serviceId: crypto.randomUUID(),
        bookingUnit: 'DATE_RANGE',
        checkInDate: '2026-10-14',
        checkOutDate: '2026-10-10', // checkout before checkin!
        startDateTime: new Date('2026-10-14T15:00:00Z'),
        endDateTime: new Date('2026-10-10T11:00:00Z'),
        partySize: 1,
      });
    }).toThrow();
  });
});
