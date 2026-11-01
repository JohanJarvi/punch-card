import { act, fireEvent, render, screen } from "@testing-library/react";
import { Settings } from "luxon";
import { AppContext } from "@/pages/_app";
import { toDayKey } from "@/utils/DayKey";
import { Clock } from "./Clock";

const startButton = () => screen.getByRole("button", { name: "Start" });
const stopButton = () => screen.getByRole("button", { name: "Stop" });

const tick = (seconds: number) => {
  // One second at a time, flushing state in between, like real time passing
  for (let i = 0; i < seconds; i++) {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  }
};

describe("Clock", () => {
  const originalZone = Settings.defaultZone;
  let onSave: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-02T00:00:00Z"));
    Settings.defaultZone = "Australia/Sydney";
    localStorage.clear();

    // Stand in for the page, which writes the saved total to storage
    onSave = jest.fn((total: number) =>
      localStorage.setItem(toDayKey(), String(total))
    );

    render(
      <AppContext.Provider value={{ workDayLength: 8 }}>
        <Clock timeInLieuInSeconds={8 * 3600} onSave={onSave} />
      </AppContext.Provider>
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    Settings.defaultZone = originalZone;
  });

  const stored = () => Number(localStorage.getItem(toDayKey()));

  it("does not count or save while stopped", () => {
    tick(45);

    expect(onSave).not.toHaveBeenCalled();
    expect(localStorage.getItem("isRunning")).toBeNull();
  });

  it("starting records the running state and a start time", () => {
    fireEvent.click(startButton());

    expect(localStorage.getItem("isRunning")).toBe("true");
    expect(localStorage.getItem(`${toDayKey()}-start`)).toBe(
      "2026-11-02T00:00:00.000Z"
    );
    expect(stopButton()).toBeTruthy();
  });

  it("autosaves every 30 seconds and keeps counting from zero", () => {
    fireEvent.click(startButton());
    onSave.mockClear();

    tick(29);
    expect(onSave).not.toHaveBeenCalled();

    tick(1);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(stored()).toBe(30);

    tick(30);
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(stored()).toBe(60);

    tick(30);
    expect(stored()).toBe(90);
  });

  it("stopping saves the time since the last autosave", () => {
    fireEvent.click(startButton());

    tick(45); // autosave at 30s, then 15s counted
    expect(stored()).toBe(30);

    fireEvent.click(stopButton());

    expect(stored()).toBe(45);
    expect(localStorage.getItem("isRunning")).toBe("false");
    expect(startButton()).toBeTruthy();

    onSave.mockClear();
    tick(60);
    expect(onSave).not.toHaveBeenCalled();
    expect(stored()).toBe(45);
  });

  it("the Save button saves the elapsed time and restarts the count", () => {
    fireEvent.click(startButton());
    tick(10);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(stored()).toBe(10);

    tick(5);
    fireEvent.click(stopButton());
    expect(stored()).toBe(15);
  });

  it("adds to time already recorded for today", () => {
    localStorage.setItem(toDayKey(), "100");

    fireEvent.click(startButton());
    tick(30);

    expect(stored()).toBe(130);
  });
});
