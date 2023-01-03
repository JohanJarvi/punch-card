import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/Button/Button";
import { TimerDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { getSecondsDiff } from "./utils/DateUtils";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );
  const [totalTimeWorkedSeconds, setTotalTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage.getItem(`${dateToday}-total`) || "0")
  );
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [timerStartDateTime, setTimerStartDateTime] = useState<Date>();
  const [timerStopDateTime, setTimerStopDateTime] = useState<Date>();
  const [timerOn, toggleTimer] = useState(true);

  const setStartTime = () => {
    const localeDateString = new Date().toLocaleDateString();
    const newStartTime = new Date();
    localStorage.setItem(`${localeDateString}-start`, new Date().toString());
    setTimerStartDateTime(newStartTime);
  };

  const setStopTime = () => {
    const localeDateString = new Date().toLocaleDateString();
    const newStartTime = new Date();
    localStorage.setItem(`${localeDateString}-stop`, new Date().toString());
    setTimerStopDateTime(newStartTime);
  };

  const incrementWorkTotal = (increment: number, localeDateString: string) => {
    const totalSoFar = Number.parseInt(
      localStorage.getItem(`${localeDateString}-total`) || "0"
    );

    localStorage.setItem(
      `${localeDateString}-total`,
      (increment + totalSoFar).toString()
    );

    setTotalTimeWorkedSeconds(increment + totalSoFar);
  };

  useEffect(() => {
    const date = new Date().toLocaleDateString();
    const bankedUpSeconds = Number.parseInt(
      localStorage.getItem(`${date}-safeguard`) || "0"
    );

    if (bankedUpSeconds > 0) {
      incrementWorkTotal(bankedUpSeconds, date);
      localStorage.setItem(`${date}-safeguard`, "0");
    }
  }, []);

  useEffect(() => {
    if (timerOn) {
      setStartTime();
    } else {
      setStopTime();
    }
  }, [timerOn]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    const date = new Date().toLocaleDateString();

    if (timerOn) {
      interval = setInterval(() => {
        const secondsDiff = getSecondsDiff(
          timerStartDateTime || new Date(),
          new Date()
        );
        setTimeWorkedSeconds(secondsDiff);
        localStorage.setItem(`${date}-safeguard`, secondsDiff.toString());
      }, 1000);
    } else {
      localStorage.setItem(`${date}-safeguard`, "0");
      incrementWorkTotal(timeWorkedSeconds, date);
    }

    return function cleanup() {
      clearInterval(interval);
    };
  }, [timerStartDateTime, timerStopDateTime]);

  useEffect(() => {
    const date = new Date().toLocaleDateString();

    localStorage.setItem(date, timeWorkedSeconds.toString());

    const workDayInSeconds = 7.6 * 60 * 60;
    setTimeLeftSeconds(workDayInSeconds - timeWorkedSeconds);
  }, [timeWorkedSeconds]);

  const handleTimerToggle = () => toggleTimer(!timerOn);

  return (
    <div className="container">
      <h1>{new Date().toLocaleDateString()}</h1>
      <Button
        active={timerOn}
        onClick={handleTimerToggle}
        label={timerOn ? "Stop" : "Start"}
      />
      <TimerDisplay
        seconds={timeWorkedSeconds}
        message="Time since clock-in:"
      />
      <h2>Work Totals</h2>
      <WorkHistory timeWorkedSeconds={totalTimeWorkedSeconds} />
    </div>
  );
}
