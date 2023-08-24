import { useMemo } from "react";
import { Workday } from "../../../../types/WorkHistory";
import { convertSecondsToHoursMinutesSecondsString } from "../../../../utils/TimeConverter";

interface WorkHistoryDayProps {
  day: Workday;
  onDelete: (day: Workday) => void;
}

export const WorkHistoryDay = ({ day, onDelete }: WorkHistoryDayProps) => {
  const isToday = useMemo(
    () => new Date().toLocaleDateString() === day.date,
    [day]
  );

  return (
    <div className="flex flex-row justify-around font-mono mb-2">
      <span className={`${isToday && "font-bold"}`}>{day.date}</span>
      <span className={`${isToday && "font-bold"}`}>
        {convertSecondsToHoursMinutesSecondsString(day.time)}
      </span>
      <button
        className="bg-slate-200 rounded-full w-16 hover:bg-slate-300"
        onClick={() => onDelete(day)}
      >
        <div className="flex flex-row justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-slate-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};
