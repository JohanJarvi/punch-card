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
 * Time still owed across the given days (positive) or banked (negative):
 * what a full work day is worth minus what was actually worked. Days with an
 * unreadable time are skipped.
 */
export const getTimeInLieuInSeconds = (
  days: { time: number }[],
  hoursInWorkDay: number
): number =>
  days
    .filter((day) => Number.isFinite(day.time))
    .reduce((total, day) => total + (hoursInWorkDay * 60 * 60 - day.time), 0);
