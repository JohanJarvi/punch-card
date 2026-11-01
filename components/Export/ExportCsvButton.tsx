import { Workday } from "@/models/WorkHistory";
import { toDayKey } from "@/utils/DayKey";
import { buildHistoryCsv } from "@/utils/FinancialYear";

interface ExportCsvButtonProps {
  workHistories: Workday[];
}

export const ExportCsvButton = ({ workHistories }: ExportCsvButtonProps) => {
  const handleExport = () => {
    const csv = buildHistoryCsv(workHistories);
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `punch-card-history-${toDayKey()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600"
    >
      Export full history (CSV)
    </button>
  );
};
