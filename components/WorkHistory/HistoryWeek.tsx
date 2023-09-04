import { getValidDateObjectFromLocalDateString } from "@/utils/DateUtils";
import { HistoryWeek, Workday } from "../../models/WorkHistory";
import { WorkHistoryDay } from "./HistoryDay";

interface WorkHistoryWeekProps {
  week: HistoryWeek;
  onDelete: (day: Workday) => void;
  onEdit: (day: Workday) => void;
}

export const WorkHistoryWeek = ({
  week,
  onDelete,
  onEdit,
}: WorkHistoryWeekProps) => {
  const handleDelete = (day: Workday) => {
    onDelete(day);
  };

  const handleEdit = (day: Workday) => {
    onEdit(day);
  };

  return (
    <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg">
      <h2 className="font-bold font-mono mb-4 text-xl self-center">
        Week {week.week}
      </h2>
      {week.histories
        .sort((a, b) =>
          getValidDateObjectFromLocalDateString(a.date) >
          getValidDateObjectFromLocalDateString(b.date)
            ? -1
            : 1
        )
        .map((historyDay) => {
          return (
            <WorkHistoryDay
              key={historyDay.date}
              day={historyDay}
              onDelete={handleDelete}
              onEdit={handleEdit}
            ></WorkHistoryDay>
          );
        })}
    </div>
  );
};
