import { useMemo } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import { Workday } from "@/models/WorkHistory";

interface WorkHistoryDayProps {
  day: Workday;
  onDelete: (day: Workday) => void;
  onEdit: (day: Workday) => void;
}

export const WorkHistoryDay = ({
  day,
  onDelete,
  onEdit,
}: WorkHistoryDayProps) => {
  const isToday = useMemo(
    () => new Date().toLocaleDateString() === day.date,
    [day]
  );

  return (
    <div className="flex flex-row font-mono mb-2 justify-between text-sm md:text-base lg:text-lg">
      <span className={`${isToday && "font-bold"} flex justify-center w-40`}>
        {day.date}
      </span>
      <span className={`${isToday && "font-bold"} flex justify-center w-40`}>
        {convertSecondsToHoursMinutesSecondsString(day.time)}
      </span>
      <div className="flex flex-row justify-center w-40">
        <button
          className="bg-slate-100 rounded-full w-8 hover:bg-slate-200 flex justify-center items-center"
          title={`Edit ${day.date}`}
          onClick={() => onEdit(day)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-slate-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
        <button
          className="bg-slate-100 rounded-full w-8 hover:bg-slate-200 flex items-center justify-center"
          title={`Delete ${day.date}`}
          onClick={() => onDelete(day)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-slate-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
