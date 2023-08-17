import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../utils/TimeConverter";
import { getSecondsDiff } from "../utils/DateUtils";

interface ClockProps {
  timeInLieuInSeconds: number;
  onSave: Function;
}

export const Clock = ({ timeInLieuInSeconds, onSave }: ClockProps) => {
  const localDateString = new Date().toLocaleDateString();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const getStartDateFromLocalStorage = (): Date => {
    const utcString = localStorage.getItem(`${localDateString}-start`);
    return utcString ? new Date(utcString) : new Date();
  };

  useEffect(() => {
    performSave();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (isRunning) {
      const startDateLocalStorage = getStartDateFromLocalStorage();
      const timeNow = new Date();
      const secondsDiff = getSecondsDiff(startDateLocalStorage, timeNow);

      intervalId = setInterval(() => setTime(secondsDiff + 1), 1000);
    }

    return () => clearInterval(intervalId);
  }, [time, isRunning]);

  const timeLeftInSeconds = timeInLieuInSeconds - time;

  const setStartTime = () => {
    localStorage.setItem(
      `${new Date().toLocaleDateString()}-start`,
      new Date().toISOString()
    );
  };

  const performSave = () => {
    const currentTimeWorked = Number(
      localStorage.getItem(localDateString) || ""
    );

    const totalTimeWorked = currentTimeWorked + time;

    onSave(totalTimeWorked);
  };

  const getTimeLeftDisplay = (timeLeftInSeconds: number): string => {
    const absoluteTimeLeftSeconds = Math.abs(timeLeftInSeconds);
    if (timeLeftInSeconds < 0) {
      return `Overtime worked: ${convertSecondsToHoursMinutesSecondsString(
        absoluteTimeLeftSeconds
      )}`;
    } else {
      return `Time left: ${convertSecondsToHoursMinutesSecondsString(
        absoluteTimeLeftSeconds
      )}`;
    }
  };

  const toggleTimer = () => {
    performSave();
    if (isRunning) {
      setIsRunning(false);
      setTime(0);
    } else {
      setIsRunning(true);
      setStartTime();
    }
  };

  return (
    <>
      <p>{getTimeLeftDisplay(timeLeftInSeconds)}</p>
      <button onClick={() => toggleTimer()}>
        {isRunning ? "Stop" : "Start"}
      </button>
    </>
  );
};
