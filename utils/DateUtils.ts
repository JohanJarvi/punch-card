import { DateTime } from "luxon";

export const isValidDateKey = (possibleDateKey: string): boolean => {
  const re = /\d+\/\d+\/\d{4}/gm;

  return re.test(possibleDateKey);
};

export const getSecondsDiff = (startDate: Date, endDate: Date) => {
  return Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / 1000);
};

export const getTimeLeftInSecondsOfWorkWeek = (
  timeWorkedInSecondsThisWeek: number,
  daysInWorkWeek?: number,
  hoursInWorkDay?: number
): number => {
  const daysWorked = daysInWorkWeek || 5;
  const hoursPerDay = hoursInWorkDay || 7.6;

  return daysWorked * hoursPerDay * 60 * 60 - timeWorkedInSecondsThisWeek;
};

/**
 * Workday dates are stored in localStorage using `Date.toLocaleDateString()`
 * and are currently assumed to be in day/month/year order.
 */
export const WORKDAY_DATE_FORMAT = "d/M/yyyy";

export const parseWorkdayDate = (dateKey: string): DateTime =>
  DateTime.fromFormat(dateKey, WORKDAY_DATE_FORMAT);
