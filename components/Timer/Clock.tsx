import { useEffect, useState } from "react";
import { RemainingDisplay } from "./RemainingDisplay";
import { getSecondsDiff } from "../../utils/DateUtils";

interface ClockProps {
  timeInLieuInSeconds: number;
  onSave: Function;
}

export const Clock = ({ timeInLieuInSeconds, onSave }: ClockProps) => {
  const localStorage =
    typeof window !== "undefined" ? window.localStorage : undefined;

  const [time, setTime] = useState(0);
  const [timeSinceSave, setTimeSinceSave] = useState(0);
  const [isRunning, setIsRunning] = useState(
    localStorage && localStorage.getItem("isRunning") === "true"
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const getStartDateFromLocalStorage = (): Date => {
      const utcString =
        localStorage &&
        localStorage.getItem(`${new Date().toLocaleDateString()}-start`);
      return utcString ? new Date(utcString) : new Date();
    };

    if (isRunning) {
      if (timeSinceSave >= 30) {
        handleHistorySave();
      }

      intervalId = setInterval(() => {
        const startDateLocalStorage = getStartDateFromLocalStorage();
        const timeNow = new Date();
        const secondsDiff = getSecondsDiff(startDateLocalStorage, timeNow);

        setTimeSinceSave(timeSinceSave + 1);
        setTime(secondsDiff);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [time, isRunning]);

  const setStartTime = () => {
    localStorage &&
      localStorage.setItem(
        `${new Date().toLocaleDateString()}-start`,
        new Date().toISOString()
      );
  };

  const performSave = () => {
    const currentTimeWorked = Number(
      (localStorage && localStorage.getItem(new Date().toLocaleDateString())) ||
        ""
    );

    const totalTimeWorked = currentTimeWorked + time;

    onSave(totalTimeWorked);
  };

  const timeLeftSeconds = timeInLieuInSeconds - time;

  const toggleTimer = () => {
    if (isRunning) {
      performSave();
      localStorage && localStorage.setItem("isRunning", "false");
      setIsRunning(false);
      setTime(0);
    } else {
      performSave();
      localStorage && localStorage.setItem("isRunning", "true");
      setIsRunning(true);
      setStartTime();
    }
  };

  const handleHistorySave = () => {
    performSave();
    setTime(0);
    setTimeSinceSave(0);
    setStartTime();
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-3/4 2xl:w-1/3">
      <div className="flex flex-row items-center justify-around">
        {!isRunning ? (
          <button
            className="text-xl bg-lime-300 rounded-full px-5 drop-shadow-md hover:bg-lime-200 h-12 w-36 md:w-48"
            onClick={() => toggleTimer()}
          >
            Start
          </button>
        ) : (
          <button
            className="text-xl bg-red-300 rounded-full px-5 drop-shadow-md hover:bg-red-200 h-12 w-36 md:w-48"
            onClick={() => toggleTimer()}
          >
            Stop
          </button>
        )}

        <button
          className="text-xl bg-slate-400 rounded-full px-5 drop-shadow-md hover:bg-slate-300 h-12 w-36 md:w-48"
          onClick={handleHistorySave}
        >
          Save
        </button>
      </div>
      <RemainingDisplay timeLeftSeconds={timeLeftSeconds}></RemainingDisplay>
    </div>
  );
};
