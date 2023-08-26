const appendZeroIfLessThan10 = (input: number): string =>
  input < 10 ? `0${input}` : input.toString();

const addMinusSignToFrontOfString = (input: string): string => `-${input}`;

export const convertSecondsToHoursMinutesSecondsString = (
  seconds: number
): string => {
  // Hours
  const absoluteSeconds = Math.abs(seconds);
  const inputHours = absoluteSeconds / 3600;
  const flooredHours = Math.floor(inputHours);

  // Minutes
  const inputMinutes = absoluteSeconds / 60;
  const remainingMinutes = inputMinutes - flooredHours * 60;
  const flooredRemainingMinutes = Math.floor(remainingMinutes);

  // Seconds
  const remainingSeconds =
    absoluteSeconds - flooredHours * 3600 - flooredRemainingMinutes * 60;

  const hoursMinutesSecondsString = `${appendZeroIfLessThan10(
    flooredHours
  )}:${appendZeroIfLessThan10(
    flooredRemainingMinutes
  )}:${appendZeroIfLessThan10(remainingSeconds)}`;

  if (seconds < 0)
    return addMinusSignToFrontOfString(hoursMinutesSecondsString);

  return hoursMinutesSecondsString;
};

export const convertHoursMinutesSecondsStringToSeconds = (
  hoursMinutesSecondsString: string 
): number => {
  if (!/\d{2}:\d{2}:\d{2}/i.test(hoursMinutesSecondsString)) return NaN;
  
  const hours = Number.parseInt(hoursMinutesSecondsString.substring(0,2))
  const minutes = Number.parseInt(hoursMinutesSecondsString.substring(3,5))
  const seconds = Number.parseInt(hoursMinutesSecondsString.substring(6,8))

  return hours * 60 * 60 + minutes * 60 + seconds;
};

