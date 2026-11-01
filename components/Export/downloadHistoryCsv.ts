import { Workday } from "@/models/WorkHistory";
import { toDayKey } from "@/utils/DayKey";
import { buildHistoryCsv } from "@/utils/FinancialYear";

/** Builds the full-history CSV and saves it as a file in the browser. */
export const downloadHistoryCsv = (workHistories: Workday[]) => {
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
