import { readWorkdays } from "./Storage";

describe("readWorkdays", () => {
  beforeEach(() => localStorage.clear());

  it("returns nothing without storage", () => {
    expect(readWorkdays(undefined)).toEqual([]);
  });

  it("reads only ISO day keys, as numbers of seconds", () => {
    localStorage.setItem("2026-11-02", "27360");
    localStorage.setItem("2026-11-02-start", "2026-11-01T20:00:00.000Z");
    localStorage.setItem("2/11/2026", "100");
    localStorage.setItem("isRunning", "true");

    expect(readWorkdays(localStorage)).toEqual([
      { date: "2026-11-02", time: 27360 },
    ]);
  });

  it("keeps a day with an unreadable value as NaN so it stays visible", () => {
    localStorage.setItem("2026-11-03", "oops");

    const [day] = readWorkdays(localStorage);

    expect(day.date).toBe("2026-11-03");
    expect(day.time).toBeNaN();
  });
});
