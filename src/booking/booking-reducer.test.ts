import { describe, expect, it } from 'vitest';
import { availableTimes } from './available-times';
import { initializeTimes, updateTimes } from './booking-reducer';

describe('initializeTimes', () => {
  it('should return the available times for that date when initializeTimes is called', () => {
    const today = new Date(2026, 9, 8);

    expect(initializeTimes(today)).toEqual(availableTimes(today));
  });
});

describe('updateTimes', () => {
  it('should return times for the chosen date when the date changes', () => {
    const previous = ['17:00'];
    const nextDate = new Date(2026, 9, 15);

    expect(updateTimes(previous, { type: 'date-changed', date: nextDate })).toEqual(
      availableTimes(nextDate),
    );
  });

  it('should leave the previous times unchanged when the date changes', () => {
    const previous = ['17:00'];

    updateTimes(previous, { type: 'date-changed', date: new Date(2026, 9, 15) });

    expect(previous).toEqual(['17:00']);
  });
});
