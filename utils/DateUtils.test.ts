import {
  getEnumeratedWeekDayFromLocaleDateString,
  getTimeLeftInSecondsOfWorkWeek,
  getValidDateObjectFromLocalDateString,
  getYearFromLocaleDateString,
} from "./DateUtils";

describe("getEnumeratedWeekDayFromLocaleDateString", () => {
  it("should throw an error if the regex is not matched", () => {
    // Given
    const incorrectDateString = "19-12-2022";

    // Then
    expect(() =>
      getEnumeratedWeekDayFromLocaleDateString(incorrectDateString)
    ).toThrowError(
      "Invalid locale date string format: 19-12-2022 - must be in the shape DD/MM/YYYY"
    );
  });

  it("should return 1 if the date is a Monday", () => {
    // Given
    const localeDateString = "19/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(1);
  });

  it("should return 2 if the date is a Tuesday", () => {
    // Given
    const localeDateString = "20/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(2);
  });

  it("should return 3 if the date is a Wednesday", () => {
    // Given
    const localeDateString = "21/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(3);
  });

  it("should return 4 if the date is a Thursday", () => {
    // Given
    const localeDateString = "22/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(4);
  });

  it("should return 5 if the date is a Friday", () => {
    // Given
    const localeDateString = "23/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(5);
  });

  it("should return 6 if the date is a Saturday", () => {
    // Given
    const localeDateString = "24/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(6);
  });

  it("should return 0 if the date is a Sunday", () => {
    // Given
    const localeDateString = "25/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    // Then
    expect(result).toBe(0);
  });
});

describe("getValidDateObjectFromLocalDateString", () => {
  it("should parse '03/01/2023' into a valid date object", () => {
    // Given
    const localeDateString = "03/01/2023";

    // When
    const result = getValidDateObjectFromLocalDateString(localeDateString);

    // Then
    expect(result).toEqual(new Date("2023-01-03"));
  });

  it("should parse '3/1/2023' into a valid date object", () => {
    // Given
    const localeDateString = "3/1/2023";

    // When
    const result = getValidDateObjectFromLocalDateString(localeDateString);

    // Then
    expect(result).toEqual(new Date("2023-01-03"));
  });

  it("should parse '03/1/2023' into a valid date object", () => {
    // Given
    const localeDateString = "03/1/2023";

    // When
    const result = getValidDateObjectFromLocalDateString(localeDateString);

    // Then
    expect(result).toEqual(new Date("2023-01-03"));
  });

  it("should parse '3/01/2023' into a valid date object", () => {
    // Given
    const localeDateString = "3/01/2023";

    // When
    const result = getValidDateObjectFromLocalDateString(localeDateString);

    // Then
    expect(result).toEqual(new Date("2023-01-03"));
  });

  it("should parse '11/11/2011' into a valid date object", () => {
    // Given
    const localeDateString = "11/11/2011";

    // When
    const result = getValidDateObjectFromLocalDateString(localeDateString);

    // Then
    expect(result).toEqual(new Date("2011-11-11"));
  });
});

describe("getYearFromLocaleDateString", () => {
  it("should be able to take various locale date strings and give the year correct year", () => {
    // Given
    const years = ["12/2/2022", "13/04/2021", "1/1/1996", "02/12/2123"];

    // When
    const results = years.map((year) => getYearFromLocaleDateString(year));

    // Then
    expect(results).toEqual([2022, 2021, 1996, 2123]);
  });
});

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
