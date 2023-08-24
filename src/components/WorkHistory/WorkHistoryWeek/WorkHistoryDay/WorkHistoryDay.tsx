import { useMemo } from "react";
import { Workday } from "../../../../types/WorkHistory";
import { convertSecondsToHoursMinutesSecondsString } from "../../../../utils/TimeConverter";

interface WorkHistoryDayProps {
  day: Workday;
}

export const WorkHistoryDay = ({ day }: WorkHistoryDayProps) => {
  const isToday = useMemo(
    () => new Date().toLocaleDateString() === day.date,
    [day]
  );

  return (
    <div className="flex flex-row justify-around font-mono">
      <span className={`${isToday && "font-bold"}`}>{day.date}</span>
      <span className={`${isToday && "font-bold"}`}>
        {convertSecondsToHoursMinutesSecondsString(day.time)}
      </span>
    </div>
  );
};
