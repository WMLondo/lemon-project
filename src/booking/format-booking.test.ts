import { describe, expect, it } from 'vitest';
import { createConfirmation, formatBookingDate, formatGuestCount } from './format-booking';

describe('createConfirmation', () => {
  it('should return an LL reference when a valid booking is confirmed', () => {
    const confirmation = createConfirmation({
      date: '2026-10-08',
      time: '17:30',
      guests: 4,
      occasion: 'Anniversary',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '3125550148',
      request: '',
    });

    expect(confirmation.reference).toBe('LL-20261008-1730-4');
    expect(confirmation.occasion).toBe('Anniversary');
  });
});

describe('formatGuestCount', () => {
  it('should return a singular guest label when the party is one', () => {
    expect(formatGuestCount('1')).toBe('1 guest');
  });

  it('should return a plural guest label when the party is greater than one', () => {
    expect(formatGuestCount('6')).toBe('6 guests');
  });
});

describe('formatBookingDate', () => {
  it('should return an em dash when the slip date is empty', () => {
    expect(formatBookingDate('')).toBe('—');
  });
});
