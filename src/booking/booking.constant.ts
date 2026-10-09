export const OCCASIONS = ['Birthday', 'Anniversary'] as const;

export type Occasion = (typeof OCCASIONS)[number];

export const GUEST_LIMIT = { min: 1, max: 10 } as const;

export const REQUEST_LIMIT = 200;

export const NAME_LIMIT = 40;

export const PHONE_DIGIT_LIMIT = { min: 7, max: 15 } as const;

export const BOOKING_FIELD = {
  date: 'date',
  time: 'time',
  guests: 'guests',
  occasion: 'occasion',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  request: 'request',
} as const;

export type BookingField = (typeof BOOKING_FIELD)[keyof typeof BOOKING_FIELD];

export const FIELD_ID = {
  date: 'res-date',
  time: 'res-time',
  guests: 'guests',
  occasion: 'occasion',
  firstName: 'first-name',
  lastName: 'last-name',
  email: 'email',
  phone: 'phone',
  request: 'special-requests',
} as const satisfies Record<BookingField, string>;
