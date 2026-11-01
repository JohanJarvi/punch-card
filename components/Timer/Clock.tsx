import { useEffect, useRef, useState } from "react";
import { RemainingDisplay } from "./RemainingDisplay";
import { getSecondsDiff } from "../../utils/DateUtils";
import { toDayKey } from "../../utils/DayKey";
import { storage } from "../../utils/Storage";

interface ClockProps {
  timeInLieuInSeconds: number;
  onSave: (timeInSeconds: number) => void;
}

export const Clock = ({ timeInLieuInSeconds, onSave }: ClockProps) => {
  const [time, setTime] = useState(0);
  const [timeSinceSave, setTimeSinceSave] = useState(0);
  const [isRunning, setIsRunning] = useState(
    storage?.getItem("isRunning") === "true"
  );

  const setStartTime = () => {
    storage?.setItem(`${toDayKey()}-start`, new Date().toISOString());
  };

  const performSave = (elapsedSeconds: number = time) => {
    const currentTimeWorked = Number(storage?.getItem(toDayKey()) || "");

    const totalTimeWorked = currentTimeWorked + elapsedSeconds;

    onSave(totalTimeWorked);
  };

  const handleHistorySave = (elapsedSeconds: number = time) => {
    performSave(elapsedSeconds);
    setTime(0);
    setTimeSinceSave(0);
    setStartTime();
  };

  const getStartDate = (): Date => {
    const startedAt = storage?.getItem(`${toDayKey()}-start`);
    return startedAt ? new Date(startedAt) : new Date();
  };

  const tick = () => {
    const secondsDiff = getSecondsDiff(getStartDate(), new Date());

    if (timeSinceSave + 1 >= 30) {
      handleHistorySave(secondsDiff);
    } else {
      setTimeSinceSave(timeSinceSave + 1);
      setTime(secondsDiff);
    }
  };

  // The interval runs for as long as the clock is running and always calls the
  // latest tick, so it never works with stale state.
  const latestTick = useRef(tick);
  useEffect(() => {
    latestTick.current = tick;
  });

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => latestTick.current(), 1000);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const timeLeftSeconds = timeInLieuInSeconds - time;

  const toggleTimer = () => {
    if (isRunning) {
      performSave();
      storage?.setItem("isRunning", "false");
      setIsRunning(false);
      setTime(0);
    } else {
      performSave();
      storage?.setItem("isRunning", "true");
      setIsRunning(true);
      setStartTime();
    }
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
          onClick={() => handleHistorySave()}
        >
          Save
        </button>
      </div>
      <RemainingDisplay timeLeftSeconds={timeLeftSeconds}></RemainingDisplay>
    </div>
  );
};
