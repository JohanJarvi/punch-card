import { useEffect, useState } from "react";
import { RemainingDisplay } from "./RemainingDisplay/RemainingDisplay";
import { getSecondsDiff } from "../../utils/DateUtils";

interface ClockProps {
  timeInLieuInSeconds: number;
  onSave: Function;
}

export const Clock = ({ timeInLieuInSeconds, onSave }: ClockProps) => {
  const [time, setTime] = useState(0);
  const [timeSinceSave, setTimeSinceSave] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    const getStartDateFromLocalStorage = (): Date => {
      const utcString = localStorage.getItem(
        `${new Date().toLocaleDateString()}-start`
      );
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
    localStorage.setItem(
      `${new Date().toLocaleDateString()}-start`,
      new Date().toISOString()
    );
  };

  const performSave = () => {
    const currentTimeWorked = Number(
      localStorage.getItem(new Date().toLocaleDateString()) || ""
    );

    const totalTimeWorked = currentTimeWorked + time;

    onSave(totalTimeWorked);
  };

  const timeLeftSeconds = timeInLieuInSeconds - time;

  const toggleTimer = () => {
    if (isRunning) {
      performSave();
      setIsRunning(false);
      setTime(0);
    } else {
      performSave();
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
    <div className="flex flex-col gap-4 w-full md:w-3/4 2xl:w-1/2">
      <div className="flex flex-row items-center justify-around">
        {!isRunning ? (
          <button
            className="text-xl bg-slate-400 rounded-full px-5 drop-shadow-md hover:bg-lime-300 h-12 w-36 md:w-48"
            onClick={() => toggleTimer()}
          >
            Start
          </button>
        ) : (
          <button
            className="text-xl bg-slate-400 rounded-full px-5 drop-shadow-md hover:bg-red-300 h-12 w-36 md:w-48"
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
