const appendZeroIfLessThan10 = (input: number): string =>
  input < 10 ? `0${input}` : input.toString();

export const convertSecondsToHoursMinutesSecondsString = (
  seconds: number
): string => {
  // Hours
  const inputHours = seconds / 3600;
  const flooredHours = Math.floor(inputHours);

  // Minutes
  const inputMinutes = seconds / 60;
  const remainingMinutes = inputMinutes - flooredHours * 60;
  const flooredRemainingMinutes = Math.floor(remainingMinutes);

  // Seconds
  const remainingSeconds =
    seconds - flooredHours * 3600 - flooredRemainingMinutes * 60;

  return `${appendZeroIfLessThan10(flooredHours)}:${appendZeroIfLessThan10(
    flooredRemainingMinutes
  )}:${appendZeroIfLessThan10(remainingSeconds)}`;
};
