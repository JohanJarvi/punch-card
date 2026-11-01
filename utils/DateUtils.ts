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
