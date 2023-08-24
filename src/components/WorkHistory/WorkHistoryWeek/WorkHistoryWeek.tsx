import { HistoryWeek, Workday } from "../../../types/WorkHistory";
import { WorkHistoryDay } from "./WorkHistoryDay/WorkHistoryDay";

interface WorkHistoryWeekProps {
  week: HistoryWeek;
  onDelete: (day: Workday) => void;
}

export const WorkHistoryWeek = ({ week, onDelete }: WorkHistoryWeekProps) => {
  const handleDelete = (day: Workday) => {
    onDelete(day);
  };

  return (
    <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg">
      <h2 className="font-bold font-mono mb-4 text-xl self-center">
        Week {week.week}
      </h2>
      {week.histories.map((historyDay) => {
        return (
          <WorkHistoryDay
            key={historyDay.date}
            day={historyDay}
            onDelete={handleDelete}
          ></WorkHistoryDay>
        );
      })}
    </div>
  );
};
