import { fireEvent, render, screen } from "@testing-library/react";
import { DateTime, Settings } from "luxon";
import { AppContext } from "@/pages/_app";
import { DeleteOldHistory } from "./DeleteOldHistory";
import { downloadHistoryCsv } from "../Export/downloadHistoryCsv";

jest.mock("../Export/downloadHistoryCsv", () => ({
  downloadHistoryCsv: jest.fn(),
}));

const hours = (h: number) => h * 3600;

const history = [
  { date: "2024-08-01", time: hours(8) },
  { date: "2025-08-01", time: hours(7) },
  { date: "2026-08-01", time: hours(6) },
];

const renderComponent = (
  workHistories = history,
  onDelete: jest.Mock = jest.fn()
) => {
  render(
    <AppContext.Provider value={{ workDayLength: 8 }}>
      <DeleteOldHistory workHistories={workHistories} onDelete={onDelete} />
    </AppContext.Provider>
  );
  return onDelete;
};

describe("DeleteOldHistory", () => {
  const originalNow = Settings.now;
  const originalZone = Settings.defaultZone;

  beforeEach(() => {
    jest.clearAllMocks();
    Settings.defaultZone = "Australia/Sydney";
    // Computed up front: DateTime.fromISO itself reads Settings.now
    const fixedNow = DateTime.fromISO("2026-11-02T07:00:00", {
      zone: "Australia/Sydney",
    }).toMillis();
    Settings.now = () => fixedNow;
  });

  afterEach(() => {
    Settings.now = originalNow;
    Settings.defaultZone = originalZone;
  });

  it("renders nothing when there is nothing older than the current financial year", () => {
    renderComponent([{ date: "2026-08-01", time: hours(6) }]);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("offers to delete history before the current financial year", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Delete history before Jul26-Jun27" })
    ).toBeTruthy();
  });

  it("explains what will be deleted, kept and how time in lieu changes", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Delete history before/ }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("2 days");
    expect(dialog.textContent).toContain("Jul24-Jun25, Jul25-Jun26");
    expect(dialog.textContent).toContain("1 day in Jul26-Jun27 will be kept");
    // owed before: 0 + 1h + 2h = 3h; after: only the 2h from the kept day
    expect(dialog.textContent).toContain("03:00:00");
    expect(dialog.textContent).toContain("02:00:00");
  });

  it("cannot delete until the export has been downloaded", () => {
    const onDelete = renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Delete history before/ }));

    const deleteButton = screen.getByRole("button", { name: /Delete 2 days/ });
    expect((deleteButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(deleteButton);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("exports the full history, then deletes only the days before the current year", () => {
    const onDelete = renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Delete history before/ }));

    fireEvent.click(screen.getByRole("button", { name: /Download export/ }));
    expect(downloadHistoryCsv).toHaveBeenCalledWith(history);

    const deleteButton = screen.getByRole("button", { name: /Delete 2 days/ });
    expect((deleteButton as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith([history[0], history[1]]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("deletes nothing on cancel, and asks for a fresh export next time", () => {
    const onDelete = renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Delete history before/ }));
    fireEvent.click(screen.getByRole("button", { name: /Download export/ }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Delete history before/ }));
    const deleteButton = screen.getByRole("button", { name: /Delete 2 days/ });
    expect((deleteButton as HTMLButtonElement).disabled).toBe(true);
  });
});
