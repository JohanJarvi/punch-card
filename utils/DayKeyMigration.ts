import { DateTime } from "luxon";
import { toDayKey } from "./DayKey";

/**
 * Day keys used to be written with `Date.toLocaleDateString()`, e.g.
 * `2/11/2026` in en-AU or `11/2/2026` in en-US, with the clock's start
 * time under `<date>-start`. This converts them to ISO day keys.
 */
export const LEGACY_BACKUP_KEY = "punch-card:backup:legacy-day-keys";

const START_SUFFIX = "-start";
const LEGACY_KEY_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(-start)?$/;

export type DateOrder = "dmy" | "mdy" | "ymd";

/** The order a locale writes numeric dates in, according to Luxon/Intl. */
export const getLocaleDateOrder = (locale?: string): DateOrder => {
  const probe = DateTime.fromObject({ year: 2001, month: 2, day: 3 });
  const parts = (locale ? probe.setLocale(locale) : probe).toLocaleParts(
    DateTime.DATE_SHORT
  );

  const order = parts
    .map((part) => part.type)
    .filter((type) => ["day", "month", "year"].includes(type))
    .map((type) => type[0])
    .join("");

  return order === "mdy" || order === "ymd" ? order : "dmy";
};

/**
 * Converts a legacy `d/M/yyyy` or `M/d/yyyy` string to a date. A value above
 * 12 in either position settles which is the day; otherwise the locale's
 * order decides.
 */
export const parseLegacyDate = (
  value: string,
  order: DateOrder
): DateTime | null => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const first = Number(match[1]);
  const second = Number(match[2]);
  const year = Number(match[3]);

  const monthFirst =
    first > 12 ? false : second > 12 ? true : order === "mdy";

  const date = DateTime.fromObject({
    year,
    month: monthFirst ? first : second,
    day: monthFirst ? second : first,
  });

  return date.isValid ? date : null;
};

export type MigrationResult = {
  migrated: number;
  /** Legacy keys left untouched because they could not be moved safely. */
  skipped: string[];
};

/**
 * Moves legacy locale-formatted keys to ISO day keys. Safe to run repeatedly:
 * - the original values are copied to a backup entry before anything changes
 * - an existing ISO key is never overwritten; a legacy key whose ISO key
 *   already holds a different value is left in place and reported
 * - a legacy key is only removed once its replacement has been written
 */
export const migrateLegacyDayKeys = (
  storage: Pick<Storage, "length" | "key" | "getItem" | "setItem" | "removeItem">,
  order: DateOrder = getLocaleDateOrder()
): MigrationResult => {
  const legacyKeys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && LEGACY_KEY_PATTERN.test(key)) legacyKeys.push(key);
  }

  const result: MigrationResult = { migrated: 0, skipped: [] };
  if (legacyKeys.length === 0) return result;

  if (storage.getItem(LEGACY_BACKUP_KEY) === null) {
    const backup = Object.fromEntries(
      legacyKeys.map((key) => [key, storage.getItem(key)])
    );
    storage.setItem(LEGACY_BACKUP_KEY, JSON.stringify(backup));
  }

  for (const legacyKey of legacyKeys) {
    const isStartKey = legacyKey.endsWith(START_SUFFIX);
    const datePart = isStartKey
      ? legacyKey.slice(0, -START_SUFFIX.length)
      : legacyKey;

    const date = parseLegacyDate(datePart, order);
    const value = storage.getItem(legacyKey);
    if (!date || value === null) {
      result.skipped.push(legacyKey);
      continue;
    }

    const newKey = toDayKey(date) + (isStartKey ? START_SUFFIX : "");
    const existing = storage.getItem(newKey);

    if (existing !== null && existing !== value) {
      result.skipped.push(legacyKey);
      continue;
    }

    if (existing === null) storage.setItem(newKey, value);
    storage.removeItem(legacyKey);
    result.migrated++;
  }

  return result;
};
