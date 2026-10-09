// IANA Timezone validation & date math utilities

export function isValidIanaTimezone(tz: string): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function isValidIsoDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString + 'T00:00:00Z');
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
}

export function calculateNights(checkInDate: string, checkOutDate: string): number {
  if (!isValidIsoDate(checkInDate) || !isValidIsoDate(checkOutDate)) {
    throw new Error(`Invalid date format for nights calculation: ${checkInDate}, ${checkOutDate}`);
  }
  const checkIn = new Date(checkInDate + 'T00:00:00Z');
  const checkOut = new Date(checkOutDate + 'T00:00:00Z');
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Evaluates whether two discrete calendar night ranges [checkIn, checkOut) overlap.
 * Uses half-open interval math [start, end) where check-out day is exclusive.
 * This permits same-day turnover (Guest A checks out Oct 14, Guest B checks in Oct 14).
 */
export function doDateRangesOverlap(
  checkInA: string,
  checkOutA: string,
  checkInB: string,
  checkOutB: string
): boolean {
  if (
    !isValidIsoDate(checkInA) ||
    !isValidIsoDate(checkOutA) ||
    !isValidIsoDate(checkInB) ||
    !isValidIsoDate(checkOutB)
  ) {
    throw new Error('All parameters must be valid ISO YYYY-MM-DD dates');
  }
  if (checkInA >= checkOutA || checkInB >= checkOutB) {
    throw new Error('checkIn must be strictly before checkOut');
  }

  // In half-open intervals [A_start, A_end) and [B_start, B_end):
  // Overlap occurs if and only if (A_start < B_end) AND (B_start < A_end)
  return checkInA < checkOutB && checkInB < checkOutA;
}
