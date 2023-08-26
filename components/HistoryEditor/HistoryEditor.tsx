import { useState } from "react";
import {
  convertHoursMinutesSecondsStringToSeconds,
  convertSecondsToHoursMinutesSecondsString,
} from "../../utils/TimeConverter";
import { Workday } from "@/models/WorkHistory";

interface HistoryEditorProps {
  workDayToEdit: Workday;
  onClose: () => void;
  onSave: (day: Workday) => void;
}

export const HistoryEditor = ({
  workDayToEdit,
  onClose,
  onSave,
}: HistoryEditorProps) => {
  const [newTime, setNewTime] = useState(0);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());
    const newTime = json["newTime"].toString();

    const convertedTime = convertHoursMinutesSecondsStringToSeconds(newTime);
    setNewTime(convertedTime);

    if (!Number.isNaN(convertedTime)) {
      onSave({ ...workDayToEdit, time: convertedTime });
    }
  };

  return (
    <div className="absolute bg-slate-200 drop-shadow-md rounded-lg z-10 flex flex-col items-center justify-around inset-x-0 bottom-0 md:inset-1/3 xl:top-1/3 xl:inset-x-1/2 xl:w-1/6 xl:h-1/6">
      <span className="flex mt-2 text-lg font-bold">{workDayToEdit.date}</span>
      <div className="flex flex-col">
        <span className="flex w-48 justify-center">Current</span>
        <span className="flex w-48 justify-center font-mono">
          {convertSecondsToHoursMinutesSecondsString(workDayToEdit.time)}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <form method="post" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 items-center">
            <input
              name="newTime"
              className={`rounded p-1 bg-slate-100 outline outline-1 outline-slate-400 text-slate-900 placeholder-slate-500 ${
                Number.isNaN(newTime) && "outline-red-500"
              }`}
              placeholder="HH:mm:ss"
            />

            {Number.isNaN(newTime) && (
              <div>
                <span className="flex w-48 justify-center text-sm text-red-500">
                  Invalid time format
                </span>
                <span className="flex w-48 justify-center text-sm">
                  Must be entered as HH:mm:ss
                </span>
                <span className="flex w-48 justify-center text-sm">
                  E.g. 08:00:00
                </span>
              </div>
            )}
            <button
              type="submit"
              className="bg-slate-400 rounded-full px-5 drop-shadow-lg h-8 w-18 hover:bg-slate-300 mb-10"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <button
        className="bg-slate-200 rounded-full w-8 hover:bg-slate-300 flex items-center justify-center absolute right-0 top-1 m-2"
        title="Close"
        onClick={() => onClose()}
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
  );
};
