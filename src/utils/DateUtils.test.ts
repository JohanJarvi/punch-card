import {
  getEnumeratedWeekDayFromLocaleDateString,
  getWeekNumberOfYearFromDateKey,
} from "./DateUtils";

describe("getEnumeratedWeekDayFromLocaleDateString", () => {
  it("should throw an error if the regex is not matched", () => {
    const incorrectDateString = "19-12-2022";

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

    expect(result).toBe(1);
  });

  it("should return 2 if the date is a Tuesday", () => {
    // Given
    const localeDateString = "20/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(2);
  });

  it("should return 3 if the date is a Wednesday", () => {
    // Given
    const localeDateString = "21/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(3);
  });

  it("should return 4 if the date is a Thursday", () => {
    // Given
    const localeDateString = "22/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(4);
  });

  it("should return 5 if the date is a Friday", () => {
    // Given
    const localeDateString = "23/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(5);
  });

  it("should return 6 if the date is a Saturday", () => {
    // Given
    const localeDateString = "24/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(6);
  });

  it("should return 0 if the date is a Sunday", () => {
    // Given
    const localeDateString = "25/12/2022";

    // When
    const result = getEnumeratedWeekDayFromLocaleDateString(localeDateString);

    expect(result).toBe(0);
  });
});

describe("getWeekNumberOfYearFromDateKey", () => {
  it("should return week 1 when the date is in the first week of year", () => {
    // Given
    const localDateString = "03/01/2023";

    // When
    const result = getWeekNumberOfYearFromDateKey(localDateString);

    expect(result).toBe(1);
  });

  it("should return week 52 when the date is in the last week of year", () => {
    // Given
    const localDateString = "31/12/2022";

    // When
    const result = getWeekNumberOfYearFromDateKey(localDateString);

    expect(result).toBe(52);
  });

  it("should return week 1 when the date is in the last week of year", () => {
    // Given
    const localDateString = "02/01/2023";

    // When
    const result = getWeekNumberOfYearFromDateKey(localDateString);

    expect(result).toBe(1);
  });
});
