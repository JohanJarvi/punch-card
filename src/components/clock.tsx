import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../utils/TimeConverter";
import { getSecondsDiff } from "../utils/DateUtils";

interface ClockProps {
  timeInLieuInSeconds: number;
  onSave: Function;
}

export const Clock = ({ timeInLieuInSeconds, onSave }: ClockProps) => {
  const [time, setTime] = useState(0);
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
      intervalId = setInterval(() => {
        const startDateLocalStorage = getStartDateFromLocalStorage();
        const timeNow = new Date();
        const secondsDiff = getSecondsDiff(startDateLocalStorage, timeNow);

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

  const absoluteTimeLeftSeconds = Math.abs(timeInLieuInSeconds - time);
  let timeLeftDisplay;
  if (timeLeftSeconds < 0) {
    timeLeftDisplay = `${convertSecondsToHoursMinutesSecondsString(
      absoluteTimeLeftSeconds
    )} overtime worked today`;
  } else {
    timeLeftDisplay = `${convertSecondsToHoursMinutesSecondsString(
      absoluteTimeLeftSeconds
    )} (${((absoluteTimeLeftSeconds / (7.6 * 60 * 60)) * 100).toFixed(
      2
    )}%) remains today`;
  }

  const finishDate = new Date();
  finishDate.setSeconds(finishDate.getSeconds() + timeLeftSeconds);

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
    setStartTime();
  };

  return (
    <>
      <h2>{timeLeftDisplay}</h2>
      <p>
        {finishDate < new Date()
          ? `You should have finished working on ${finishDate.toLocaleString()}`
          : `You should finish working on ${finishDate.toLocaleString()}`}
      </p>
      <button onClick={() => toggleTimer()}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={handleHistorySave}>Save in history</button>
    </>
  );
};
