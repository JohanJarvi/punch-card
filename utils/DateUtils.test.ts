import { getTimeLeftInSecondsOfWorkWeek } from "./DateUtils";

describe("getTimeLeftInSecondsOfWorkWeek", () => {
  let standardWorkWeekDurationInSeconds: number;
  beforeEach(() => {
    const averageWorkWeekLength = 5;
    const averageWorkWeekHours = 7.6;
    const workWeekDurationInHours =
      averageWorkWeekLength * averageWorkWeekHours;
    const workWeekDurationInMinutes = workWeekDurationInHours * 60;
    const workWeekDurationInSeconds = workWeekDurationInMinutes * 60;

    standardWorkWeekDurationInSeconds = workWeekDurationInSeconds;
  });

  it("should return a full 38 hour 5 day work week in seconds if no work has been done and no optional params are added", () => {
    // Given
    const timeWorkedInSecondsThisWeek = 0;

    // When
    const result = getTimeLeftInSecondsOfWorkWeek(timeWorkedInSecondsThisWeek);

    // Then
    expect(result).toBe(standardWorkWeekDurationInSeconds);
  });

  it("should return a full 38 hour 5 day work week in seconds minus the seconds worked in a week if no optional params are added", () => {
    // Given
    const timeWorkedInSecondsThisWeek = 1240;

    // When
    const result = getTimeLeftInSecondsOfWorkWeek(timeWorkedInSecondsThisWeek);

    // Then
    expect(result).toBe(
      standardWorkWeekDurationInSeconds - timeWorkedInSecondsThisWeek
    );
  });

  it("should return a full 30.4 hour 4 day work week in seconds minus the seconds worked in a week if number of work days was specified", () => {
    // Given
    const timeWorkedInSecondsThisWeek = 1240;

    // When
    const result = getTimeLeftInSecondsOfWorkWeek(
      timeWorkedInSecondsThisWeek,
      4
    );

    // Then
    expect(result).toBe(
      standardWorkWeekDurationInSeconds -
        7.6 * 3600 -
        timeWorkedInSecondsThisWeek
    );
  });

  it("should return a full 44 hour 4 day work week in seconds minus the seconds worked in a week if number of work days was specified and work day duration was also specified", () => {
    // Given
    const timeWorkedInSecondsThisWeek = 1240;
    const daysInWorkWeek = 4;
    const hoursInWorkDay = 12;
    const workDayDurationSeconds = daysInWorkWeek * hoursInWorkDay * 3600;

    // When
    const result = getTimeLeftInSecondsOfWorkWeek(
      timeWorkedInSecondsThisWeek,
      daysInWorkWeek,
      hoursInWorkDay
    );

    // Then
    expect(result).toBe(workDayDurationSeconds - timeWorkedInSecondsThisWeek);
  });
});
