import { useEffect, useMemo, useState } from "react";
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
      const startDateLocalStorage = getStartDateFromLocalStorage();
      const timeNow = new Date();
      const secondsDiff = getSecondsDiff(startDateLocalStorage, timeNow);

      intervalId = setInterval(() => setTime(secondsDiff + 1), 1000);
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

  const timeLeftDisplay = useMemo(() => {
    const timeLeftSeconds = timeInLieuInSeconds - time;
    const absoluteTimeLeftSeconds = Math.abs(timeInLieuInSeconds - time);
    if (timeLeftSeconds < 0) {
      return `Overtime worked: ${convertSecondsToHoursMinutesSecondsString(
        absoluteTimeLeftSeconds
      )}`;
    } else {
      return `Time left: ${convertSecondsToHoursMinutesSecondsString(
        absoluteTimeLeftSeconds
      )}`;
    }
  }, [timeInLieuInSeconds, time]);

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
      <p>{timeLeftDisplay}</p>
      <button onClick={() => toggleTimer()}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={handleHistorySave}>Save in history</button>
    </>
  );
};
