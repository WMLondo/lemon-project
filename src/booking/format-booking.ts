import type { ValidBooking } from './validate-booking';

export type Confirmation = ValidBooking & { reference: string };

const EM_DASH = '—';

export const createConfirmation = (booking: ValidBooking): Confirmation => ({
  ...booking,
  reference: `LL-${booking.date.replaceAll('-', '')}-${booking.time.replace(':', '')}-${booking.guests}`,
});

export const formatBookingDate = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return EM_DASH;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return EM_DASH;
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatBookingTime = (time: string): string => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) {
    return EM_DASH;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    return EM_DASH;
  }
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
};

export const formatGuestCount = (guests: string): string => {
  if (!/^\d+$/.test(guests)) {
    return EM_DASH;
  }
  const count = Number(guests);
  if (count < 1) {
    return EM_DASH;
  }
  return count === 1 ? '1 guest' : `${count} guests`;
};

export const formatGuestName = (firstName: string, lastName: string): string => {
  const name = `${firstName.trim()} ${lastName.trim()}`.trim();
  return name === '' ? EM_DASH : name;
};
