import { cloneElement, type FormEvent, type ReactElement } from 'react';
import {
  FIELD_ID,
  GUEST_LIMIT,
  NAME_LIMIT,
  OCCASIONS,
  REQUEST_LIMIT,
  type BookingField,
} from '../booking.constant';
import { formatBookingTime } from '../format-booking';
import type { BookingDraft, FieldError } from '../validate-booking';

export type BookingFormProps = {
  draft: BookingDraft;
  times: ReadonlyArray<string>;
  errors: ReadonlyArray<FieldError>;
  minDate: string;
  onFieldChange: (field: BookingField, value: string) => void;
  onSubmit: () => void;
};

const errorFor = (
  errors: ReadonlyArray<FieldError>,
  field: BookingField,
): string | undefined => errors.find((item) => item.field === field)?.message;

type FieldControlProps = {
  id?: string;
  'aria-invalid'?: 'true' | 'false';
  'aria-describedby'?: string;
};

type FieldProps = {
  id: string;
  label: string;
  error: string | undefined;
  hint?: string;
  children: ReactElement<FieldControlProps>;
};

const Field = ({ id, label, error, hint, children }: FieldProps) => {
  const describedBy = [hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined]
    .filter((value): value is string => value !== undefined)
    .join(' ');

  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy === '' ? undefined : describedBy,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
};

const change =
  (field: BookingField, onFieldChange: BookingFormProps['onFieldChange']) =>
  (event: { target: { value: string } }) => {
    onFieldChange(field, event.target.value);
  };

export const BookingForm = ({
  draft,
  times,
  errors,
  minDate,
  onFieldChange,
  onSubmit,
}: BookingFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const timeHint =
    times.length === 0
      ? 'No tables are open that evening. Choose another date.'
      : 'Seatings run from 5:00 PM to 11:30 PM.';

  return (
    <form className="booking-form" aria-label="Reserve a table" onSubmit={handleSubmit}>
      {errors.length > 0 ? (
        <div className="form-alert" role="alert">
          <p>Some details need another look.</p>
          <ul>
            {errors.map((item) => (
              <li key={item.field}>{item.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="field-row">
        <Field
          id={FIELD_ID.firstName}
          label="First name"
          error={errorFor(errors, 'firstName')}
        >
          <input
            name="first-name"
            type="text"
            autoComplete="given-name"
            required
            maxLength={NAME_LIMIT}
            placeholder="Jordan…"
            value={draft.firstName}
            onChange={change('firstName', onFieldChange)}
          />
        </Field>
        <Field id={FIELD_ID.lastName} label="Last name" error={errorFor(errors, 'lastName')}>
          <input
            name="last-name"
            type="text"
            autoComplete="family-name"
            required
            maxLength={NAME_LIMIT}
            placeholder="Lee…"
            value={draft.lastName}
            onChange={change('lastName', onFieldChange)}
          />
        </Field>
      </div>

      <div className="field-row">
        <Field id={FIELD_ID.email} label="Email" error={errorFor(errors, 'email')}>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            placeholder="name@domain.com…"
            value={draft.email}
            onChange={change('email', onFieldChange)}
          />
        </Field>
        <Field id={FIELD_ID.phone} label="Phone" error={errorFor(errors, 'phone')}>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="(312) 555-0148…"
            value={draft.phone}
            onChange={change('phone', onFieldChange)}
          />
        </Field>
      </div>

      <div className="field-row">
        <Field
          id={FIELD_ID.date}
          label="Choose date"
          error={errorFor(errors, 'date')}
          hint="Today or a later evening."
        >
          <input
            name="res-date"
            type="date"
            required
            min={minDate}
            value={draft.date}
            onChange={change('date', onFieldChange)}
          />
        </Field>
        <Field
          id={FIELD_ID.guests}
          label="Number of guests"
          error={errorFor(errors, 'guests')}
          hint="Parties of 1 to 10."
        >
          <input
            name="guests"
            type="number"
            inputMode="numeric"
            required
            min={GUEST_LIMIT.min}
            max={GUEST_LIMIT.max}
            step={1}
            placeholder="2"
            value={draft.guests}
            onChange={change('guests', onFieldChange)}
          />
        </Field>
      </div>

      <Field
        id={FIELD_ID.time}
        label="Choose time"
        error={errorFor(errors, 'time')}
        hint={timeHint}
      >
        <select
          name="res-time"
          required
          value={draft.time}
          onChange={change('time', onFieldChange)}
        >
          <option value="">{times.length === 0 ? 'No tables this evening' : 'Select a time'}</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {formatBookingTime(time)}
            </option>
          ))}
        </select>
      </Field>

      <Field id={FIELD_ID.occasion} label="Occasion" error={errorFor(errors, 'occasion')}>
        <select
          name="occasion"
          required
          value={draft.occasion}
          onChange={change('occasion', onFieldChange)}
        >
          <option value="">Select an occasion</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={FIELD_ID.request}
        label="Special requests"
        error={errorFor(errors, 'request')}
        hint="Optional. A high chair, a quiet corner, a note for the kitchen."
      >
        <textarea
          name="special-requests"
          rows={3}
          maxLength={REQUEST_LIMIT}
          placeholder="Window table, high chair…"
          value={draft.request}
          onChange={change('request', onFieldChange)}
        />
      </Field>

      <button className="reserve-button" type="submit">
        Make Your Reservation
      </button>
    </form>
  );
};
