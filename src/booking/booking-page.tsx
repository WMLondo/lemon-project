import { useReducer, useState } from 'react';
import diningTable from '../assets/dining-table.jpg';
import { availableTimes } from './available-times';
import { BOOKING_FIELD, FIELD_ID, type BookingField } from './booking.constant';
import { initializeTimes, updateTimes } from './booking-reducer';
import { BookingForm, ConfirmationPanel, LemonMark, ReservationSlip } from './components';
import { createConfirmation, type Confirmation } from './format-booking';
import {
  createBookingDraft,
  parseDateInput,
  toDateInputValue,
  validateBooking,
  type BookingDraft,
  type FieldError,
} from './validate-booking';
import './booking.css';

export type BookingPageProps = {
  today?: Date;
};

type BookingScreen =
  | { status: 'editing'; draft: BookingDraft; errors: ReadonlyArray<FieldError> }
  | { status: 'confirmed'; confirmation: Confirmation };

export const BookingPage = ({ today }: BookingPageProps) => {
  const [clock] = useState(() => today ?? new Date());
  const [times, dispatch] = useReducer(updateTimes, clock, initializeTimes);
  const [screen, setScreen] = useState<BookingScreen>(() => ({
    status: 'editing',
    draft: createBookingDraft(clock),
    errors: [],
  }));

  const handleFieldChange = (field: BookingField, value: string) => {
    if (field === BOOKING_FIELD.date) {
      const parsed = parseDateInput(value);
      if (parsed) {
        dispatch({ type: 'date-changed', date: parsed });
      }
    }

    setScreen((current) => {
      if (current.status !== 'editing') {
        return current;
      }
      const parsed = field === BOOKING_FIELD.date ? parseDateInput(value) : undefined;
      const openTimes = parsed ? availableTimes(parsed) : times;
      const nextTime =
        field === BOOKING_FIELD.time
          ? value
          : field === BOOKING_FIELD.date && !openTimes.includes(current.draft.time)
            ? ''
            : current.draft.time;
      return {
        status: 'editing',
        errors: [],
        draft: {
          ...current.draft,
          [field]: value,
          time: nextTime,
        },
      };
    });
  };

  const handleSubmit = () => {
    if (screen.status !== 'editing') {
      return;
    }
    const result = validateBooking(screen.draft, { today: clock, times });
    if (result.status === 'invalid') {
      setScreen({ status: 'editing', draft: screen.draft, errors: result.errors });
      const firstError = result.errors[0];
      if (firstError) {
        document.getElementById(FIELD_ID[firstError.field])?.focus();
      }
      return;
    }
    setScreen({ status: 'confirmed', confirmation: createConfirmation(result.booking) });
  };

  const handleBookAnother = () => {
    dispatch({ type: 'date-changed', date: clock });
    setScreen({ status: 'editing', draft: createBookingDraft(clock), errors: [] });
  };

  return (
    <div className="page">
      <a className="skip-link" href="#reserve">
        Skip to reservation
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top">
          <LemonMark />
          Little Lemon
        </a>
        <p className="header-place">Chicago · Mediterranean</p>
        <a className="header-link" href="#reserve">
          Reserve a Table
        </a>
      </header>
      <main id="top" className="site-main">
        {screen.status === 'confirmed' ? (
          <div className="layout">
            <figure className="hero-figure">
              <img
                src={diningTable}
                alt="Lemon, grilled fish, and olive oil on a wooden table"
                width={1248}
                height={832}
              />
              <figcaption>Mediterranean supper in Chicago.</figcaption>
            </figure>
            <ConfirmationPanel confirmation={screen.confirmation} onBookAnother={handleBookAnother} />
          </div>
        ) : (
          <div className="layout">
            <section className="intro">
              <p className="slip-kicker">Evenings from 5</p>
              <h1>Reserve a Table</h1>
              <p className="intro-copy">
                Little Lemon serves a Mediterranean menu in Chicago. Tell us the evening, the hour,
                and who is coming.
              </p>
              <figure className="hero-figure">
                <img
                  src={diningTable}
                  alt="Lemon, grilled fish, and olive oil on a wooden table"
                  width={1248}
                  height={832}
                />
                <figcaption>Mediterranean supper in Chicago.</figcaption>
              </figure>
            </section>
            <div className="booking-panel" id="reserve">
              <ReservationSlip draft={screen.draft} />
              <BookingForm
                draft={screen.draft}
                times={times}
                errors={screen.errors}
                minDate={toDateInputValue(clock)}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <p>Little Lemon · Chicago</p>
        <p>Seatings from 5:00 PM to 11:30 PM. Parties of 1 to 10.</p>
      </footer>
    </div>
  );
};
