import { DateTime } from "luxon";
import {
  buildFinancialYearCsv,
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
      { date: "30/6/2025", time: hours(7.5) },
      { date: "1/7/2025", time: hours(8) },
    ]);

    expect(result.map((r) => [r.label, r.hours])).toEqual([
      ["Jul24-Jun25", 7.5],
      ["Jul25-Jun26", 8],
    ]);
  });

  it("sums days within a financial year across the calendar year boundary", () => {
    const result = summariseFinancialYears([
      { date: "15/12/2025", time: hours(7) },
      { date: "15/1/2026", time: hours(8) },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      label: "Jul25-Jun26",
      totalSeconds: hours(15),
      hours: 15,
    });
  });

  it("sorts oldest financial year first", () => {
    const result = summariseFinancialYears([
      { date: "1/8/2026", time: hours(1) },
      { date: "1/8/2024", time: hours(1) },
      { date: "1/8/2025", time: hours(1) },
    ]);

    expect(result.map((r) => r.label)).toEqual([
      "Jul24-Jun25",
      "Jul25-Jun26",
      "Jul26-Jun27",
    ]);
  });

  it("rounds hours to two decimal places", () => {
    const result = summariseFinancialYears([
      { date: "1/8/2025", time: 1000 },
    ]);

    expect(result[0].hours).toBe(0.28);
  });

  it("ignores entries with an unparseable date or time", () => {
    const result = summariseFinancialYears([
      { date: "not-a-date", time: hours(5) },
      { date: "1/8/2025", time: NaN },
      { date: "1/8/2025", time: hours(2) },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].hours).toBe(2);
  });
});

describe("buildFinancialYearCsv", () => {
  it("returns just the header when there is no history", () => {
    expect(buildFinancialYearCsv([])).toBe("Financial year,Hours\n");
  });

  it("writes one row per financial year", () => {
    const csv = buildFinancialYearCsv([
      { date: "1/8/2024", time: hours(1900) },
      { date: "1/8/2025", time: hours(12.5) },
    ]);

    expect(csv).toBe(
      "Financial year,Hours\nJul24-Jun25,1900.00\nJul25-Jun26,12.50\n"
    );
  });
});
