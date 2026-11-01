import { DateTime, Settings } from "luxon";
import { formatDayKey, isDayKey, parseDayKey, toDayKey } from "./DayKey";

describe("DayKey", () => {
  const originalZone = Settings.defaultZone;
  const originalNow = Settings.now;

  afterEach(() => {
    Settings.defaultZone = originalZone;
    Settings.now = originalNow;
  });

  describe("toDayKey", () => {
    it("uses the local date, not the UTC date, early in the morning in Sydney", () => {
      Settings.defaultZone = "Australia/Sydney";
      const sevenAm = DateTime.fromISO("2026-11-02T07:00:00", {
        zone: "Australia/Sydney",
      });
      Settings.now = () => sevenAm.toMillis();

      // The same instant is still the day before in UTC
      expect(sevenAm.toUTC().toISODate()).toBe("2026-11-01");
      expect(toDayKey()).toBe("2026-11-02");
    });

    it("uses the local date late in the evening west of UTC", () => {
      Settings.defaultZone = "America/Los_Angeles";
      const tenPm = DateTime.fromISO("2026-11-02T22:00:00", {
        zone: "America/Los_Angeles",
      });
      Settings.now = () => tenPm.toMillis();

      // 10pm in Los Angeles is already the next day in UTC
      expect(tenPm.toUTC().toISODate()).toBe("2026-11-03");
      expect(toDayKey()).toBe("2026-11-02");
    });

    it("zero pads the month and day", () => {
      expect(toDayKey(DateTime.local(2026, 3, 5))).toBe("2026-03-05");
    });

    it("throws for an invalid date", () => {
      expect(() => toDayKey(DateTime.invalid("test"))).toThrow();
    });
  });

  describe("isDayKey", () => {
    it.each(["2026-11-02", "2024-02-29"])("accepts %s", (value) => {
      expect(isDayKey(value)).toBe(true);
    });

    it.each([
      "2/11/2026",
      "2026-11-02-start",
      "2026-13-01",
      "2026-02-30",
      "isRunning",
      "",
    ])("rejects %p", (value) => {
      expect(isDayKey(value)).toBe(false);
    });
  });

  describe("parseDayKey", () => {
    it("returns midnight at the start of that local day", () => {
      Settings.defaultZone = "Australia/Sydney";
      const date = parseDayKey("2026-11-02");

      expect(date.toISO()).toBe("2026-11-02T00:00:00.000+11:00");
      expect(date.weekNumber).toBe(45);
    });
  });

  describe("formatDayKey", () => {
    it("formats in the requested locale", () => {
      expect(formatDayKey("2026-11-02", "en-US")).toBe("11/2/2026");
      expect(formatDayKey("2026-11-02", "en-GB")).toBe("02/11/2026");
    });

    it("returns the input when it is not a valid day key", () => {
      expect(formatDayKey("garbage")).toBe("garbage");
    });
  });
});
