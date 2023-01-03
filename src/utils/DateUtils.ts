const getValidDateObjectFromLocalDateString = (dateKey: string): Date => {
  const re = /..\/..\/..../gm;

  if (!re.exec(dateKey))
    throw new Error(
      `Invalid locale date string format: ${dateKey} - must be in the shape DD/MM/YYYY`
    );

  const parts = dateKey.split("/");
  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  return new Date(isoDate);
};

export const getEnumeratedWeekDayFromLocaleDateString = (
  localeDateString: string
): number => {
  return getValidDateObjectFromLocalDateString(localeDateString).getDay();
};

export const getWeekNumberOfYearFromDateKey = (
  localeDateString: string
): number => {
  const date = getValidDateObjectFromLocalDateString(localeDateString);

  const startDate = new Date(date.getFullYear(), 0, 1);
  var days = Math.floor(
    (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  return Math.ceil(days / 7);
};
