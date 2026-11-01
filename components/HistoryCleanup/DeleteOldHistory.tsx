import { useMemo, useState } from "react";
import { Workday } from "@/models/WorkHistory";
import { useAppContext } from "@/pages/_app";
import { getTimeInLieuInSeconds } from "@/utils/DateUtils";
import { planDeleteBeforeCurrentFinancialYear } from "@/utils/FinancialYear";
import { convertSecondsToHoursMinutesSecondsString } from "@/utils/TimeConverter";
import { downloadHistoryCsv } from "../Export/downloadHistoryCsv";

interface DeleteOldHistoryProps {
  workHistories: Workday[];
  onDelete: (days: Workday[]) => void;
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export const DeleteOldHistory = ({
  workHistories,
  onDelete,
}: DeleteOldHistoryProps) => {
  const { workDayLength } = useAppContext();
  const [open, setOpen] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const plan = useMemo(
    () => planDeleteBeforeCurrentFinancialYear(workHistories),
    [workHistories]
  );

  if (plan.toDelete.length === 0) return null;

  const close = () => {
    setOpen(false);
    setHasExported(false);
  };

  const handleExport = () => {
    downloadHistoryCsv(workHistories);
    setHasExported(true);
  };

  const handleDelete = () => {
    onDelete(plan.toDelete);
    close();
  };

  const lieuBefore = getTimeInLieuInSeconds(workHistories, workDayLength);
  const lieuAfter = getTimeInLieuInSeconds(plan.toKeep, workDayLength);
  const deletedHours = plan.deletedYears.reduce((sum, y) => sum + y.hours, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-red-700 text-red-50 hover:bg-red-600"
      >
        Delete history before {plan.currentLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-history-title"
            className="flex flex-col gap-4 w-full max-w-lg p-6 bg-slate-100 rounded-lg drop-shadow-lg"
          >
            <h2 id="delete-history-title" className="text-xl font-bold">
              Delete history before {plan.currentLabel}?
            </h2>

            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li>
                <strong>{plural(plan.toDelete.length, "day")}</strong> (
                {deletedHours.toFixed(2)} hours) will be deleted from{" "}
                {plan.deletedYears.map((year) => year.label).join(", ")}.
              </li>
              <li>
                {plural(plan.toKeep.length, "day")} in {plan.currentLabel} will
                be kept.
              </li>
              <li>
                Your time in lieu changes from{" "}
                <span className="font-mono">
                  {convertSecondsToHoursMinutesSecondsString(lieuBefore)}
                </span>{" "}
                to{" "}
                <span className="font-mono">
                  {convertSecondsToHoursMinutesSecondsString(lieuAfter)}
                </span>
                .
              </li>
            </ul>

            <p className="text-sm">
              This cannot be undone. Download the export first, then delete.
            </p>

            <div className="flex flex-row flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded-lg bg-slate-300 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600"
              >
                {hasExported ? "Download again" : "1. Download export (CSV)"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!hasExported}
                className="px-4 py-2 rounded-lg bg-red-700 text-red-50 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-700 disabled:cursor-not-allowed"
              >
                2. Delete {plural(plan.toDelete.length, "day")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
