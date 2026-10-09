import type { Confirmation } from '../format-booking';
import { formatBookingDate, formatBookingTime, formatGuestCount } from '../format-booking';

export type ConfirmationPanelProps = {
  confirmation: Confirmation;
  onBookAnother: () => void;
};

export const ConfirmationPanel = ({ confirmation, onBookAnother }: ConfirmationPanelProps) => (
  <section className="confirmation" role="status" aria-label="Reservation confirmed">
    <p className="slip-kicker">Little Lemon · Chicago</p>
    <h1>Thank you for your reservation</h1>
    <p className="confirmation-lead">
      Your table is noted. Show this reference when you arrive.
    </p>
    <p className="reference">{confirmation.reference}</p>
    <dl className="slip-list">
      <div>
        <dt>Name</dt>
        <dd>
          {confirmation.firstName} {confirmation.lastName}
        </dd>
      </div>
      <div>
        <dt>Date</dt>
        <dd>{formatBookingDate(confirmation.date)}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{formatBookingTime(confirmation.time)}</dd>
      </div>
      <div>
        <dt>Guests</dt>
        <dd>{formatGuestCount(String(confirmation.guests))}</dd>
      </div>
      <div>
        <dt>Occasion</dt>
        <dd>{confirmation.occasion}</dd>
      </div>
      {confirmation.request === '' ? null : (
        <div>
          <dt>Request</dt>
          <dd>{confirmation.request}</dd>
        </div>
      )}
    </dl>
    <button className="reserve-button" type="button" onClick={onBookAnother}>
      Book Another Table
    </button>
  </section>
);
