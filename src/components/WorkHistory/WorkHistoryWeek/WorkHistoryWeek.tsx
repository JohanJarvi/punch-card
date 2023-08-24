import { HistoryWeek } from "../../../types/WorkHistory";
import { WorkHistoryDay } from "./WorkHistoryDay/WorkHistoryDay";

interface WorkHistoryWeekProps {
  week: HistoryWeek;
}

export const WorkHistoryWeek = ({ week }: WorkHistoryWeekProps) => {
  return (
    <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg w-1/3">
      <h2 className="font-bold font-mono mb-4 text-xl self-center">
        Week {week.week}
      </h2>
      {week.histories.map((historyDay) => {
        return (
          <WorkHistoryDay
            key={historyDay.date}
            day={historyDay}
          ></WorkHistoryDay>
        );
      })}
    </div>
  );
};
