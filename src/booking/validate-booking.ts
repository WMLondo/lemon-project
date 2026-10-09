import {
  GUEST_LIMIT,
  NAME_LIMIT,
  OCCASIONS,
  PHONE_DIGIT_LIMIT,
  REQUEST_LIMIT,
  type BookingField,
  type Occasion,
} from './booking.constant';

export type BookingDraft = {
  date: string;
  time: string;
  guests: string;
  occasion: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  request: string;
};

export type ValidBooking = {
  date: string;
  time: string;
  guests: number;
  occasion: Occasion;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  request: string;
};

export type FieldError = {
  field: BookingField;
  message: string;
};

export type BookingValidation =
  | { status: 'invalid'; errors: ReadonlyArray<FieldError> }
  | { status: 'valid'; booking: ValidBooking };

export type BookingValidationContext = {
  today: Date;
  times: ReadonlyArray<string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }
  return date;
};

export const createBookingDraft = (today: Date): BookingDraft => ({
  date: toDateInputValue(today),
  time: '',
  guests: '',
  occasion: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  request: '',
});

const error = (field: BookingField, message: string): FieldError => ({ field, message });

const digitCount = (value: string): number => value.replace(/\D/g, '').length;

export const validateBooking = (
  draft: BookingDraft,
  context: BookingValidationContext,
): BookingValidation => {
  const errors: Array<FieldError> = [];
  const todayValue = toDateInputValue(context.today);
  const parsedDate = parseDateInput(draft.date);

  if (!parsedDate || draft.date < todayValue) {
    errors.push(error('date', 'Choose a date from today onward.'));
  }

  const time = draft.time.trim();
  if (context.times.length === 0) {
    errors.push(error('time', 'No tables are open that evening. Choose another date.'));
  } else if (!context.times.includes(time)) {
    errors.push(error('time', 'Choose an available time.'));
  }

  const guestsText = draft.guests.trim();
  const guests = /^\d+$/.test(guestsText) ? Number(guestsText) : Number.NaN;
  if (!Number.isInteger(guests) || guests < GUEST_LIMIT.min || guests > GUEST_LIMIT.max) {
    errors.push(error('guests', 'Enter 1 to 10 guests.'));
  }

  const occasion = OCCASIONS.find((item) => item === draft.occasion);
  if (!occasion) {
    errors.push(error('occasion', 'Choose Birthday or Anniversary.'));
  }

  const firstName = draft.firstName.trim();
  if (firstName === '') {
    errors.push(error('firstName', 'Enter a first name.'));
  } else if (firstName.length > NAME_LIMIT) {
    errors.push(error('firstName', 'Keep the first name to 40 characters.'));
  }

  const lastName = draft.lastName.trim();
  if (lastName === '') {
    errors.push(error('lastName', 'Enter a last name.'));
  } else if (lastName.length > NAME_LIMIT) {
    errors.push(error('lastName', 'Keep the last name to 40 characters.'));
  }

  const email = draft.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    errors.push(error('email', 'Enter an email like name@domain.com.'));
  }

  const phone = draft.phone.trim();
  const phonesDigits = digitCount(phone);
  if (phonesDigits < PHONE_DIGIT_LIMIT.min || phonesDigits > PHONE_DIGIT_LIMIT.max) {
    errors.push(error('phone', 'Enter a phone number with at least 7 digits.'));
  }

  const request = draft.request.trim();
  if (request.length > REQUEST_LIMIT) {
    errors.push(error('request', 'Keep special requests under 200 characters.'));
  }

  if (
    errors.length > 0 ||
    !parsedDate ||
    !occasion ||
    !Number.isInteger(guests)
  ) {
    return { status: 'invalid', errors };
  }

  return {
    status: 'valid',
    booking: {
      date: draft.date,
      time,
      guests,
      occasion,
      firstName,
      lastName,
      email,
      phone,
      request,
    },
  };
};
