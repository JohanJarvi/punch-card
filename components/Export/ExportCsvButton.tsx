import { Workday } from "@/models/WorkHistory";
import { downloadHistoryCsv } from "./downloadHistoryCsv";

interface ExportCsvButtonProps {
  workHistories: Workday[];
}

export const ExportCsvButton = ({ workHistories }: ExportCsvButtonProps) => (
  <button
    type="button"
    onClick={() => downloadHistoryCsv(workHistories)}
    className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600"
  >
    Export full history (CSV)
  </button>
);
