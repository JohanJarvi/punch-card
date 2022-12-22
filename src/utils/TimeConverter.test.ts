import { convertSecondsToHoursMinutesSecondsString } from "./TimeConverter";

describe("convertSecondsToHoursMinutesSeconds", () => {
  it("should return just the seconds when the seconds are less than 60", () => {
    // Given
    const input = 49;

    // When
    const result = convertSecondsToHoursMinutesSecondsString(input);

    // Then
    expect(result).toBe("00:00:49");
  });

  it("should return just the minutes and seconds when the seconds exceed 60 but are below 3600", () => {
    // Given
    const input = 124;

    // When
    const result = convertSecondsToHoursMinutesSecondsString(input);

    // Then
    expect(result).toBe("00:02:04");
  });

  it("should return everything when the seconds exceed 3600", () => {
    // Given
    const input = 3661;

    // When
    const result = convertSecondsToHoursMinutesSecondsString(input);

    // Then
    expect(result).toBe("01:01:01");
  });
});
