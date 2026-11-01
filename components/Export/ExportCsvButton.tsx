import { Workday } from "@/models/WorkHistory";
import { buildFinancialYearCsv } from "@/utils/FinancialYear";

interface ExportCsvButtonProps {
  workHistories: Workday[];
}

const FILE_NAME = "punch-card-financial-years.csv";

export const ExportCsvButton = ({ workHistories }: ExportCsvButtonProps) => {
  const handleExport = () => {
    const csv = buildFinancialYearCsv(workHistories);
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
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
      Export hours per financial year (CSV)
    </button>
  );
};
