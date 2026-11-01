import { DateTime } from "luxon";
import {
  buildHistoryCsv,
  formatFinancialYearLabel,
  getFinancialYearStart,
  summariseFinancialYears,
} from "./FinancialYear";

const hours = (h: number) => h * 3600;

describe("getFinancialYearStart", () => {
  it("starts a new financial year on 1 July", () => {
    expect(getFinancialYearStart(DateTime.local(2025, 7, 1))).toBe(2025);
  });

  it("keeps 30 June in the previous financial year", () => {
    expect(getFinancialYearStart(DateTime.local(2025, 6, 30))).toBe(2024);
  });

  it("uses the same start year for January to June", () => {
    expect(getFinancialYearStart(DateTime.local(2026, 1, 15))).toBe(2025);
  });

  it("uses the calendar year for July to December", () => {
    expect(getFinancialYearStart(DateTime.local(2025, 12, 31))).toBe(2025);
  });
});

describe("formatFinancialYearLabel", () => {
  it("formats the range as JulYY-JunYY", () => {
    expect(formatFinancialYearLabel(2025)).toBe("Jul25-Jun26");
  });

  it("pads single digit years", () => {
    expect(formatFinancialYearLabel(2008)).toBe("Jul08-Jun09");
  });

  it("handles the century rollover", () => {
    expect(formatFinancialYearLabel(2099)).toBe("Jul99-Jun00");
  });
});

describe("summariseFinancialYears", () => {
  it("returns nothing when there is no history", () => {
    expect(summariseFinancialYears([])).toEqual([]);
  });

  it("groups days either side of 30 June / 1 July into different years", () => {
    const result = summariseFinancialYears([
      { date: "2025-06-30", time: hours(7.5) },
      { date: "2025-07-01", time: hours(8) },
    ]);

    expect(result.map((r) => [r.label, r.hours])).toEqual([
      ["Jul24-Jun25", 7.5],
      ["Jul25-Jun26", 8],
    ]);
  });

  it("sums days within a financial year across the calendar year boundary", () => {
    const result = summariseFinancialYears([
      { date: "2025-12-15", time: hours(7) },
      { date: "2026-01-15", time: hours(8) },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      label: "Jul25-Jun26",
      days: 2,
      totalSeconds: hours(15),
      hours: 15,
    });
  });

  it("sorts oldest financial year first", () => {
    const result = summariseFinancialYears([
      { date: "2026-08-01", time: hours(1) },
      { date: "2024-08-01", time: hours(1) },
      { date: "2025-08-01", time: hours(1) },
    ]);

    expect(result.map((r) => r.label)).toEqual([
      "Jul24-Jun25",
      "Jul25-Jun26",
      "Jul26-Jun27",
    ]);
  });

  it("rounds hours to two decimal places", () => {
    const result = summariseFinancialYears([
      { date: "2025-08-01", time: 1000 },
    ]);

    expect(result[0].hours).toBe(0.28);
  });

  it("ignores entries with an unparseable date or time", () => {
    const result = summariseFinancialYears([
      { date: "not-a-date", time: hours(5) },
      { date: "2025-08-01", time: NaN },
      { date: "2025-08-01", time: hours(2) },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].hours).toBe(2);
  });
});

describe("buildHistoryCsv", () => {
  const exportedAt = DateTime.fromISO("2026-11-02T07:15:30.000", {
    zone: "Australia/Sydney",
  });

  it("returns only the headers and export time when there is no history", () => {
    expect(buildHistoryCsv([], exportedAt)).toBe(
      [
        "Date,Duration,Hours,Seconds",
        "",
        "Financial year,Days,Duration,Hours,Seconds",
        "",
        "Exported at,2026-11-02T07:15:30.000+11:00",
        "",
      ].join("\n")
    );
  });

  it("lists every day oldest first, then the financial year totals, then the export time", () => {
    const csv = buildHistoryCsv(
      [
        { date: "2025-08-02", time: 27360 },
        { date: "2024-08-01", time: hours(8) },
        { date: "2025-08-01", time: 3600 },
      ],
      exportedAt
    );

    expect(csv).toBe(
      [
        "Date,Duration,Hours,Seconds",
        "2024-08-01,08:00:00,8.00,28800",
        "2025-08-01,01:00:00,1.00,3600",
        "2025-08-02,07:36:00,7.60,27360",
        "",
        "Financial year,Days,Duration,Hours,Seconds",
        "Jul24-Jun25,1,08:00:00,8.00,28800",
        "Jul25-Jun26,2,08:36:00,8.60,30960",
        "",
        "Exported at,2026-11-02T07:15:30.000+11:00",
        "",
      ].join("\n")
    );
  });

  it("shows each day as a readable HH:MM:SS duration next to the date", () => {
    const csv = buildHistoryCsv(
      [{ date: "2026-11-02", time: 7 * 3600 + 23 * 60 + 21 }],
      exportedAt
    );

    expect(csv).toContain("\n2026-11-02,07:23:21,7.39,26601\n");
  });

  it("keeps the raw seconds so the log can be restored exactly", () => {
    const csv = buildHistoryCsv([{ date: "2025-08-01", time: 1001 }], exportedAt);

    expect(csv).toContain("2025-08-01,00:16:41,0.28,1001");
  });

  it("keeps a day with an unreadable time as a blank row and leaves it out of the totals", () => {
    const csv = buildHistoryCsv(
      [
        { date: "2025-08-01", time: NaN },
        { date: "2025-08-02", time: hours(2) },
      ],
      exportedAt
    );

    expect(csv).toContain("2025-08-01,,,\n");
    expect(csv).toContain("Jul25-Jun26,1,02:00:00,2.00,7200");
  });

  it("leaves out entries whose date is not a valid day key", () => {
    const csv = buildHistoryCsv(
      [
        { date: "not-a-date", time: hours(5) },
        { date: "2025-08-01", time: hours(1) },
      ],
      exportedAt
    );

    expect(csv).not.toContain("not-a-date");
    expect(csv).toContain("Jul25-Jun26,1,01:00:00,1.00,3600");
  });
});
