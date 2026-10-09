import { describe, expect, it } from 'vitest';
import { availableTimes } from './available-times';

const EVENING_SLOTS = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
] as const;

describe('availableTimes', () => {
  it('should return only evening half-hour slots when a date is given', () => {
    const times = availableTimes(new Date(2026, 9, 8));
    const allowed = new Set<string>(EVENING_SLOTS);

    expect(times.length).toBeGreaterThan(0);
    expect(times.every((time) => allowed.has(time))).toBe(true);
    expect(new Set(times).size).toBe(times.length);
  });

  it('should return matching times when two dates share a day of the month', () => {
    expect(availableTimes(new Date(2026, 0, 8))).toEqual(availableTimes(new Date(2026, 9, 8)));
  });

  it('should return a new array when the same date is read twice', () => {
    const date = new Date(2026, 9, 8);
    const first = availableTimes(date);
    const second = availableTimes(date);

    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });
});
