import { describe, expect, it } from 'vitest';
import { createBookingDraft, validateBooking, type BookingDraft } from './validate-booking';

const today = new Date(2026, 9, 8);

const completeDraft = (): BookingDraft => ({
  date: '2026-10-08',
  time: '17:00',
  guests: '4',
  occasion: 'Birthday',
  firstName: ' Ada ',
  lastName: ' Lovelace ',
  email: ' Ada@Example.com ',
  phone: '(312) 555-0148',
  request: ' Window, please. ',
});

describe('validateBooking', () => {
  it('should return field errors when required details are missing', () => {
    const result = validateBooking(createBookingDraft(today), { today, times: ['17:00'] });

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors.map((error) => error.field)).toEqual([
      'time',
      'guests',
      'occasion',
      'firstName',
      'lastName',
      'email',
      'phone',
    ]);
    expect(result.errors[0]?.message).toBe('Choose an available time.');
  });

  it('should return a date error when the evening is before today', () => {
    const result = validateBooking(
      { ...completeDraft(), date: '2026-10-07' },
      { today, times: ['17:00'] },
    );

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([
      { field: 'date', message: 'Choose a date from today onward.' },
    ]);
  });

  it('should return a guest-count error when the party is outside 1 to 10', () => {
    const result = validateBooking({ ...completeDraft(), guests: '12' }, { today, times: ['17:00'] });

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([{ field: 'guests', message: 'Enter 1 to 10 guests.' }]);
  });

  it('should return an occasion error when the occasion is not offered', () => {
    const result = validateBooking(
      { ...completeDraft(), occasion: 'Graduation' },
      { today, times: ['17:00'] },
    );

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([
      { field: 'occasion', message: 'Choose Birthday or Anniversary.' },
    ]);
  });

  it('should return an email error when the email has no domain', () => {
    const result = validateBooking(
      { ...completeDraft(), email: 'ada@' },
      { today, times: ['17:00'] },
    );

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([
      { field: 'email', message: 'Enter an email like name@domain.com.' },
    ]);
  });

  it('should return a phone error when the phone has fewer than 7 digits', () => {
    const result = validateBooking({ ...completeDraft(), phone: '312' }, { today, times: ['17:00'] });

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([
      { field: 'phone', message: 'Enter a phone number with at least 7 digits.' },
    ]);
  });

  it('should return a closed-evening error when no times are open', () => {
    const result = validateBooking(completeDraft(), { today, times: [] });

    expect(result.status).toBe('invalid');
    if (result.status !== 'invalid') {
      return;
    }
    expect(result.errors).toEqual([
      { field: 'time', message: 'No tables are open that evening. Choose another date.' },
    ]);
  });

  it('should return a valid booking when every field is acceptable', () => {
    const result = validateBooking(completeDraft(), { today, times: ['17:00', '17:30'] });

    expect(result).toEqual({
      status: 'valid',
      booking: {
        date: '2026-10-08',
        time: '17:00',
        guests: 4,
        occasion: 'Birthday',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '(312) 555-0148',
        request: 'Window, please.',
      },
    });
  });

  it('should keep the draft unchanged when validation runs', () => {
    const draft = completeDraft();
    const snapshot = { ...draft };

    validateBooking(draft, { today, times: ['17:00'] });

    expect(draft).toEqual(snapshot);
  });
});
