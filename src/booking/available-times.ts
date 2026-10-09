const MODULUS = 2 ** 35 - 31;
const MULTIPLIER = 185852;
const FIRST_SEATING_HOUR = 17;
const LAST_SEATING_HOUR = 23;

// The seating script seeds on the day of the month, so the 8th of every month shares a slate.
const seededRandom = (seed: number): (() => number) => {
  let state = seed % MODULUS;
  return () => {
    state = (state * MULTIPLIER) % MODULUS;
    return state / MODULUS;
  };
};

export const availableTimes = (date: Date): ReadonlyArray<string> => {
  const random = seededRandom(date.getDate());
  const times: Array<string> = [];

  for (let hour = FIRST_SEATING_HOUR; hour <= LAST_SEATING_HOUR; hour += 1) {
    if (random() < 0.5) {
      times.push(`${hour}:00`);
    }
    if (random() < 0.5) {
      times.push(`${hour}:30`);
    }
  }

  return times;
};
