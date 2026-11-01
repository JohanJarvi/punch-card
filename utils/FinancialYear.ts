import { DateTime } from "luxon";
import { Workday } from "@/models/WorkHistory";
import { parseDayKey } from "./DayKey";
import { convertSecondsToHoursMinutesSecondsString } from "./TimeConverter";

export type FinancialYearSummary = {
  /** Calendar year in which the financial year starts, e.g. 2025 for Jul25-Jun26 */
  startYear: number;
  /** e.g. "Jul25-Jun26" */
  label: string;
  /** Number of logged days in the financial year */
  days: number;
  totalSeconds: number;
  hours: number;
};

const FINANCIAL_YEAR_START_MONTH = 7;

const twoDigitYear = (year: number): string =>
  String(year % 100).padStart(2, "0");

export const getFinancialYearStart = (date: DateTime): number =>
  date.month >= FINANCIAL_YEAR_START_MONTH ? date.year : date.year - 1;

export const formatFinancialYearLabel = (startYear: number): string =>
  `Jul${twoDigitYear(startYear)}-Jun${twoDigitYear(startYear + 1)}`;

/**
 * Totals the time worked per financial year (1 July to 30 June), oldest first.
 * Entries whose date cannot be parsed are ignored.
 */
export const summariseFinancialYears = (
  workdays: Workday[]
): FinancialYearSummary[] => {
  const totalsByStartYear = new Map<number, { days: number; seconds: number }>();

  for (const workday of workdays) {
    const date = parseDayKey(workday.date);
    if (!date.isValid || !Number.isFinite(workday.time)) continue;

    const startYear = getFinancialYearStart(date);
    const totals = totalsByStartYear.get(startYear) ?? { days: 0, seconds: 0 };
    totalsByStartYear.set(startYear, {
      days: totals.days + 1,
      seconds: totals.seconds + workday.time,
    });
  }

  return Array.from(totalsByStartYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([startYear, { days, seconds }]) => ({
      startYear,
      label: formatFinancialYearLabel(startYear),
      days,
      totalSeconds: seconds,
      hours: Math.round((seconds / 3600) * 100) / 100,
    }));
};

const toHours = (seconds: number): string => (seconds / 3600).toFixed(2);

/**
 * The full log as CSV, oldest day first: every day with its readable
 * duration (HH:MM:SS), decimal hours and raw seconds (the lossless value),
 * then a section totalling each financial year, then when the export was
 * made.
 *
 * Days with an unreadable time keep their row with blank values so they stay
 * visible in the log, but are left out of the totals.
 */
export const buildHistoryCsv = (
  workdays: Workday[],
  exportedAt: DateTime = DateTime.local()
): string => {
  const days = workdays
    .filter((workday) => parseDayKey(workday.date).isValid)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const dayRows = days.map(({ date, time }) =>
    Number.isFinite(time)
      ? [
          date,
          convertSecondsToHoursMinutesSecondsString(time),
          toHours(time),
          String(time),
        ].join(",")
      : `${date},,,`
  );

  const summaryRows = summariseFinancialYears(workdays).map(
    ({ label, days, totalSeconds, hours }) =>
      [
        label,
        days,
        convertSecondsToHoursMinutesSecondsString(totalSeconds),
        hours.toFixed(2),
        totalSeconds,
      ].join(",")
  );

  return (
    [
      "Date,Duration,Hours,Seconds",
      ...dayRows,
      "",
      "Financial year,Days,Duration,Hours,Seconds",
      ...summaryRows,
      "",
      `Exported at,${exportedAt.toISO()}`,
    ].join("\n") + "\n"
  );
};
