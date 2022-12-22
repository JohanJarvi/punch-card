export const getEnumeratedWeekDayFromLocaleDateString = (
  localeDateString: string
): number => {
  const re = /..\/..\/..../gm;

  if (!re.exec(localeDateString))
    throw new Error(
      `Invalid locale date string format: ${localeDateString} - must be in the shape DD/MM/YYYY`
    );

  const parts = localeDateString.split("/");
  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  const date = new Date(isoDate);
  return date.getDay();
};
