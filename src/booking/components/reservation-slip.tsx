import type { BookingDraft } from '../validate-booking';
import {
  formatBookingDate,
  formatBookingTime,
  formatGuestCount,
  formatGuestName,
} from '../format-booking';

export type ReservationSlipProps = {
  draft: BookingDraft;
};

const formatOccasion = (occasion: string): string =>
  occasion === 'Birthday' || occasion === 'Anniversary' ? occasion : '—';

export const ReservationSlip = ({ draft }: ReservationSlipProps) => (
  <section className="reservation-slip" aria-label="Reservation slip">
    <p className="slip-kicker">Your table</p>
    <dl className="slip-list">
      <div>
        <dt>Date</dt>
        <dd>{formatBookingDate(draft.date)}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{formatBookingTime(draft.time)}</dd>
      </div>
      <div>
        <dt>Guests</dt>
        <dd>{formatGuestCount(draft.guests)}</dd>
      </div>
      <div>
        <dt>Occasion</dt>
        <dd>{formatOccasion(draft.occasion)}</dd>
      </div>
      <div>
        <dt>Name</dt>
        <dd>{formatGuestName(draft.firstName, draft.lastName)}</dd>
      </div>
    </dl>
  </section>
);
