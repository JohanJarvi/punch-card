import { DateTime } from "luxon";

/**
 * A "day key" is the local calendar date as an ISO date, e.g. `2026-11-02`.
 *
 * It is deliberately the date in the user's *local* zone, not the UTC date:
 * starting work at 7am in Sydney is still 2 November, even though it is
 * 1 November in UTC. Timestamps (such as the clock's start time) are stored
 * as full ISO instants instead, and are the same moment in every zone.
 */
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const toDayKey = (date: DateTime = DateTime.local()): string => {
  const key = date.toISODate();
  if (!key) throw new Error("Cannot create a day key from an invalid date");

  return key;
};

export const isDayKey = (value: string): boolean =>
  DAY_KEY_PATTERN.test(value) && DateTime.fromISO(value).isValid;

/** Midnight at the start of that day in the local zone. */
export const parseDayKey = (dayKey: string): DateTime =>
  DateTime.fromISO(dayKey);

/** Formats a day key for display in the user's locale (or the given one). */
export const formatDayKey = (dayKey: string, locale?: string): string => {
  const date = parseDayKey(dayKey);
  if (!date.isValid) return dayKey;

  return (locale ? date.setLocale(locale) : date).toLocaleString(
    DateTime.DATE_SHORT
  );
};
