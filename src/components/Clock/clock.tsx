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
    <>
      <RemainingDisplay timeLeftSeconds={timeLeftSeconds}></RemainingDisplay>
      <button onClick={() => toggleTimer()}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={handleHistorySave}>Save in history</button>
    </>
  );
};
