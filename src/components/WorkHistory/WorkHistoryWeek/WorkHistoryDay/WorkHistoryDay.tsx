import { Workday } from "../../../../types/WorkHistory";
import { convertSecondsToHoursMinutesSecondsString } from "../../../../utils/TimeConverter";

interface WorkHistoryDayProps {
  day: Workday;
}

export const WorkHistoryDay = ({ day }: WorkHistoryDayProps) => {
  return (
    <div className="flex flex-row justify-around">
      <strong>{day.date}</strong>
      <em>{convertSecondsToHoursMinutesSecondsString(day.time)}</em>
    </div>
  );
};
