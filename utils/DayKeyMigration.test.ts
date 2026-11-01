import {
  getLocaleDateOrder,
  LEGACY_BACKUP_KEY,
  migrateLegacyDayKeys,
  parseLegacyDate,
} from "./DayKeyMigration";

describe("getLocaleDateOrder", () => {
  it.each([
    ["en-AU", "dmy"],
    ["en-GB", "dmy"],
    ["en-US", "mdy"],
    ["ja-JP", "ymd"],
  ])("%s writes dates as %s", (locale, expected) => {
    expect(getLocaleDateOrder(locale)).toBe(expected);
  });
});

describe("parseLegacyDate", () => {
  it("reads day/month/year for a day/month locale", () => {
    expect(parseLegacyDate("2/11/2026", "dmy")?.toISODate()).toBe("2026-11-02");
  });

  it("reads month/day/year for a month/day locale", () => {
    expect(parseLegacyDate("2/11/2026", "mdy")?.toISODate()).toBe("2026-02-11");
  });

  it("uses a value above 12 to find the day, whatever the locale order", () => {
    expect(parseLegacyDate("25/12/2025", "mdy")?.toISODate()).toBe("2025-12-25");
    expect(parseLegacyDate("12/25/2025", "dmy")?.toISODate()).toBe("2025-12-25");
  });

  it("returns null for impossible or malformed dates", () => {
    expect(parseLegacyDate("31/2/2026", "dmy")).toBeNull();
    expect(parseLegacyDate("2026-11-02", "dmy")).toBeNull();
    expect(parseLegacyDate("nonsense", "dmy")).toBeNull();
  });
});

describe("migrateLegacyDayKeys", () => {
  beforeEach(() => localStorage.clear());

  const snapshot = () =>
    Object.fromEntries(
      Array.from({ length: localStorage.length }, (_, i) => {
        const key = localStorage.key(i)!;
        return [key, localStorage.getItem(key)];
      })
    );

  it("does nothing when there is nothing to migrate", () => {
    localStorage.setItem("2026-11-02", "100");
    localStorage.setItem("isRunning", "true");

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result).toEqual({ migrated: 0, skipped: [] });
    expect(snapshot()).toEqual({ "2026-11-02": "100", isRunning: "true" });
  });

  it("converts day keys and start keys, leaving other keys alone", () => {
    localStorage.setItem("2/11/2026", "27360");
    localStorage.setItem("2/11/2026-start", "2026-11-01T20:00:00.000Z");
    localStorage.setItem("isRunning", "true");

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result).toEqual({ migrated: 2, skipped: [] });
    const data = snapshot();
    expect(data["2026-11-02"]).toBe("27360");
    expect(data["2026-11-02-start"]).toBe("2026-11-01T20:00:00.000Z");
    expect(data["isRunning"]).toBe("true");
    expect(data["2/11/2026"]).toBeUndefined();
    expect(data["2/11/2026-start"]).toBeUndefined();
  });

  it("reads ambiguous dates using the given locale order", () => {
    localStorage.setItem("3/4/2026", "100");

    migrateLegacyDayKeys(localStorage, "mdy");

    expect(localStorage.getItem("2026-03-04")).toBe("100");
  });

  it("keeps a backup of the original values", () => {
    localStorage.setItem("2/11/2026", "27360");
    localStorage.setItem("3/11/2026", "100");

    migrateLegacyDayKeys(localStorage, "dmy");

    expect(JSON.parse(localStorage.getItem(LEGACY_BACKUP_KEY)!)).toEqual({
      "2/11/2026": "27360",
      "3/11/2026": "100",
    });
  });

  it("is safe to run twice and does not touch the backup again", () => {
    localStorage.setItem("2/11/2026", "27360");
    migrateLegacyDayKeys(localStorage, "dmy");
    const afterFirst = snapshot();

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result).toEqual({ migrated: 0, skipped: [] });
    expect(snapshot()).toEqual(afterFirst);
  });

  it("does not overwrite an existing ISO key with a different value", () => {
    localStorage.setItem("2/11/2026", "100");
    localStorage.setItem("2026-11-02", "999");

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result).toEqual({ migrated: 0, skipped: ["2/11/2026"] });
    expect(localStorage.getItem("2026-11-02")).toBe("999");
    expect(localStorage.getItem("2/11/2026")).toBe("100");
  });

  it("removes a legacy key whose ISO key already holds the same value", () => {
    localStorage.setItem("2/11/2026", "100");
    localStorage.setItem("2026-11-02", "100");

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result.migrated).toBe(1);
    expect(localStorage.getItem("2/11/2026")).toBeNull();
    expect(localStorage.getItem("2026-11-02")).toBe("100");
  });

  it("leaves keys it cannot parse in place", () => {
    localStorage.setItem("31/2/2026", "100");

    const result = migrateLegacyDayKeys(localStorage, "dmy");

    expect(result).toEqual({ migrated: 0, skipped: ["31/2/2026"] });
    expect(localStorage.getItem("31/2/2026")).toBe("100");
  });
});
