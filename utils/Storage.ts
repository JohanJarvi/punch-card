import { Workday } from "@/models/WorkHistory";
import { isDayKey } from "./DayKey";

/**
 * The browser's localStorage, or undefined on the server (where the page is
 * pre-rendered) or when the browser blocks storage access.
 *
 * A module-level constant, so components and hooks can use it without it
 * counting as a changing dependency.
 */
export const storage: Storage | undefined = (() => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
})();

/** Every stored day entry (keys that are ISO day keys), in storage order. */
export const readWorkdays = (
  source: Pick<Storage, "length" | "key" | "getItem"> | undefined
): Workday[] => {
  const workdays: Workday[] = [];
  if (!source) return workdays;

  for (let i = 0; i < source.length; i++) {
    const key = source.key(i) || "";
    if (!isDayKey(key)) continue;

    workdays.push({
      date: key,
      time: Number.parseInt(source.getItem(key) || ""),
    });
  }

  return workdays;
};
