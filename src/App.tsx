import React, { useEffect, useState } from "react";
import "./App.css";
import { TimerDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { getSecondsDiff } from "./utils/DateUtils";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [beginningOfWorkDay, setBeginningOfWorkDay] = useState<Date>();
  const [minutesOfBreak, setMinutesOfBreak] = useState(0);

  const setStartTime = () => {
    const localeDateString = new Date().toLocaleDateString();
    const existingStartTime = localStorage.getItem(`${localeDateString}-start`);

    if (!existingStartTime) {
      const newStartTime = new Date();
      localStorage.setItem(`${localeDateString}-start`, new Date().toString());
      setBeginningOfWorkDay(newStartTime);
    } else {
      setBeginningOfWorkDay(new Date(existingStartTime));
    }
  };

  useEffect(() => {
    setStartTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsDiff = getSecondsDiff(
        beginningOfWorkDay || new Date(),
        new Date()
      );
      setTimeWorkedSeconds(secondsDiff);
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [beginningOfWorkDay]);

  useEffect(() => {
    const date = new Date().toLocaleDateString();

    localStorage.setItem(
      date,
      (timeWorkedSeconds - minutesOfBreak * 60).toString()
    );

    const workDayInSeconds = 7.6 * 60 * 60;
    setTimeLeftSeconds(
      workDayInSeconds - timeWorkedSeconds + minutesOfBreak * 60
    );
  }, [timeWorkedSeconds]);

  const handleBreakInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMinutesOfBreak(Number.parseInt(event.target.value || "0"));

  return (
    <div className="container">
      <p>Time since start of work today:</p>
      <TimerDisplay seconds={timeWorkedSeconds} />
      <p>Enter minutes of break today (if any):</p>
      <input onChange={handleBreakInput}></input>
      <p>Time left today:</p>
      <TimerDisplay seconds={timeLeftSeconds} />
      <WorkHistory timeWorkedSeconds={timeWorkedSeconds} />
    </div>
  );
}
