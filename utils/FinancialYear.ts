import { DateTime } from "luxon";
import { Workday } from "@/models/WorkHistory";
import { parseDayKey } from "./DayKey";

export type FinancialYearSummary = {
  /** Calendar year in which the financial year starts, e.g. 2025 for Jul25-Jun26 */
  startYear: number;
  /** e.g. "Jul25-Jun26" */
  label: string;
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
  const secondsByStartYear = new Map<number, number>();

  for (const workday of workdays) {
    const date = parseDayKey(workday.date);
    if (!date.isValid || !Number.isFinite(workday.time)) continue;

    const startYear = getFinancialYearStart(date);
    secondsByStartYear.set(
      startYear,
      (secondsByStartYear.get(startYear) ?? 0) + workday.time
    );
  }

  return Array.from(secondsByStartYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([startYear, totalSeconds]) => ({
      startYear,
      label: formatFinancialYearLabel(startYear),
      totalSeconds,
      hours: Math.round((totalSeconds / 3600) * 100) / 100,
    }));
};

export const buildFinancialYearCsv = (workdays: Workday[]): string => {
  const rows = summariseFinancialYears(workdays).map(
    ({ label, hours }) => `${label},${hours.toFixed(2)}`
  );

  return ["Financial year,Hours", ...rows].join("\n") + "\n";
};
