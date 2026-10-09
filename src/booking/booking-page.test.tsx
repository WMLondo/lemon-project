import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { availableTimes } from './available-times';
import { BookingPage } from './booking-page';

const bookableEvening = (): { today: Date; date: string; time: string } => {
  for (let day = 8; day <= 28; day += 1) {
    const today = new Date(2026, 9, day);
    const time = availableTimes(today)[0];
    if (time) {
      return { today, date: `2026-10-${String(day).padStart(2, '0')}`, time };
    }
  }
  throw new Error('October 2026 has no bookable evening in the fixture range');
};

const fillReservation = (date: string, time: string): void => {
  fireEvent.change(screen.getByLabelText('Choose date'), { target: { value: date } });
  fireEvent.change(screen.getByLabelText('Choose time'), { target: { value: time } });
  fireEvent.change(screen.getByLabelText('Number of guests'), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText('Occasion'), { target: { value: 'Birthday' } });
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ada' } });
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Lovelace' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '3125550148' } });
};

describe('BookingPage', () => {
  it('should show the reservation fields when the page opens', () => {
    render(<BookingPage today={new Date(2026, 9, 8)} />);

    expect(screen.getByRole('heading', { name: 'Reserve a Table' })).toBeInTheDocument();
    expect(screen.getByLabelText('Choose date')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose time')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of guests')).toBeInTheDocument();
    expect(screen.getByLabelText('Occasion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Make Your Reservation' })).toBeInTheDocument();
  });

  it('should show a date error when the date is cleared and the form is submitted', () => {
    render(<BookingPage today={new Date(2026, 9, 8)} />);
    fireEvent.change(screen.getByLabelText('Choose date'), { target: { value: '' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Reserve a table' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Choose a date from today onward.');
  });

  it('should show the guest count on the slip when the guest field changes', () => {
    render(<BookingPage today={new Date(2026, 9, 8)} />);
    fireEvent.change(screen.getByLabelText('Number of guests'), { target: { value: '6' } });

    expect(screen.getByRole('region', { name: 'Reservation slip' })).toHaveTextContent('6 guests');
  });

  it('should show the confirmation reference when every field is valid', () => {
    const fixture = bookableEvening();
    render(<BookingPage today={fixture.today} />);
    fillReservation(fixture.date, fixture.time);
    fireEvent.submit(screen.getByRole('form', { name: 'Reserve a table' }));

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Thank you for your reservation');
    expect(status).toHaveTextContent('Ada Lovelace');
    expect(status).toHaveTextContent('Birthday');
    expect(status).toHaveTextContent(
      `LL-${fixture.date.replaceAll('-', '')}-${fixture.time.replace(':', '')}-4`,
    );
  });

  it('should show the form again when the guest books another table', () => {
    const fixture = bookableEvening();
    render(<BookingPage today={fixture.today} />);
    fillReservation(fixture.date, fixture.time);
    fireEvent.submit(screen.getByRole('form', { name: 'Reserve a table' }));
    fireEvent.click(screen.getByRole('button', { name: 'Book Another Table' }));

    expect(screen.getByRole('form', { name: 'Reserve a table' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Make Your Reservation' })).toBeInTheDocument();
  });
});
