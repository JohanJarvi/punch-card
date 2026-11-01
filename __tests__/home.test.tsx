import { fireEvent, render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import { AppContext } from "@/pages/_app";

const renderHome = () =>
  render(
    <AppContext.Provider value={{ workDayLength: 8 }}>
      <Home />
    </AppContext.Provider>
  );

describe("Home page", () => {
  beforeEach(() => localStorage.clear());

  it("shows no history section when nothing is stored", () => {
    renderHome();

    expect(screen.queryByText("Work History")).toBeNull();
    expect(screen.queryByRole("button", { name: /Export/ })).toBeNull();
  });

  it("migrates legacy keys on load and lists the days", () => {
    // 25 is above 12, so this is unambiguously day/month/year in any locale
    localStorage.setItem("25/12/2025", "28800");
    localStorage.setItem("2026-01-05", "27360");

    renderHome();

    expect(localStorage.getItem("2025-12-25")).toBe("28800");
    expect(localStorage.getItem("25/12/2025")).toBeNull();
    expect(screen.getByText("Work History")).toBeTruthy();
    expect(screen.getByText("08:00:00")).toBeTruthy();
    expect(screen.getByText("07:36:00")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Export full history/ })).toBeTruthy();
  });

  it("deletes a single day from storage and from the list", () => {
    localStorage.setItem("2026-01-05", "27360");
    localStorage.setItem("2026-01-06", "28800");

    renderHome();
    expect(screen.getByText("07:36:00")).toBeTruthy();

    fireEvent.click(screen.getAllByTitle(/^Delete /)[0]);

    expect(screen.getAllByTitle(/^Delete /)).toHaveLength(1);
    const remaining = ["2026-01-05", "2026-01-06"].filter(
      (key) => localStorage.getItem(key) !== null
    );
    expect(remaining).toHaveLength(1);
  });

  it("offers to delete history before the current financial year only when there is some", () => {
    localStorage.setItem("2020-08-01", "28800");
    renderHome();

    expect(
      screen.getByRole("button", { name: /Delete history before Jul/ })
    ).toBeTruthy();
  });
});
