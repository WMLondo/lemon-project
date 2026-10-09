import { availableTimes } from './available-times';

export type TimesState = ReadonlyArray<string>;

export type TimesAction = { type: 'date-changed'; date: Date };

export const initializeTimes = (today: Date): TimesState => availableTimes(today);

export const updateTimes = (state: TimesState, action: TimesAction): TimesState => {
  switch (action.type) {
    case 'date-changed':
      return availableTimes(action.date);
    default:
      return state;
  }
};
