export const getValidDateObjectFromLocalDateString = (
  dateKey: string
): Date => {
  const re = /\d+\/\d+\/\d{4}/gm;

  if (!re.exec(dateKey))
    throw new Error(
      `Invalid locale date string format: ${dateKey} - must be in the shape DD/MM/YYYY`
    );

  const parts = dateKey.split("/").map((part) => {
    const smallerParts = part.split("");

    if (smallerParts.length === 1) {
      return `0${part}`;
    } else {
      return part;
    }
  });

  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  return new Date(isoDate);
};

export const isValidDateKey = (
  possibleDateKey: string
): boolean => {
  const re = /\d+\/\d+\/\d{4}/gm;

  return re.test(possibleDateKey);
};

export const getEnumeratedWeekDayFromLocaleDateString = (
  localeDateString: string
): number => {
  return getValidDateObjectFromLocalDateString(localeDateString).getDay();
};

export const getSecondsDiff = (startDate: Date, endDate: Date) => {
  return Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / 1000);
};

export const getYearFromLocaleDateString = (
  localeDateString: string
): number => {
  const date = getValidDateObjectFromLocalDateString(localeDateString);
  return date.getFullYear();
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
