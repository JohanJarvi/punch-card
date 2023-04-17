import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/Button/Button";
import { TimerDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { getSecondsDiff } from "./utils/DateUtils";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(0);
  const [totalTimeWorkedSeconds, setTotalTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage.getItem(`${dateToday}-total`) || "0")
  );
  const [timerStartDateTime, setTimerStartDateTime] = useState<Date>();
  const [timerStopDateTime, setTimerStopDateTime] = useState<Date>();
  const [timerOn, toggleTimer] = useState(false);
  const [timeLeftWeekSeconds, setTimeLeftWeekSeconds] = useState(0);
  // const [] = useRef();

  const setStartTime = () => {
    const localeDateString = new Date().toLocaleDateString();
    const newStartTime = new Date();
    localStorage.setItem(`${localeDateString}-start`, new Date().toString());
    setTimerStartDateTime(newStartTime);
  };

  const setStopTime = () => {
    const localeDateString = new Date().toLocaleDateString();
    const newStartTime = new Date();
    localStorage.setItem(localeDateString, "0");
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

    return function cleanup() {
      localStorage.removeItem(date);
    };
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
  }, [timeWorkedSeconds]);

  const handleTimerToggle = () => toggleTimer(!timerOn);

  const handleSave = () => toggleTimer(true);
  const handleEdit = () => toggleTimer(false);

  const handleRefresh = () => {
    const date = new Date().toLocaleDateString();
    const safeGuard = Number.parseInt(
      localStorage.getItem(`${date}-safeguard`) || "0"
    );
    incrementWorkTotal(safeGuard, date);
    localStorage.setItem(date, "0");
    localStorage.setItem(`${date}-safeguard`, "0");
    setStartTime();
  };

  const handleUpdate = (input: number) => {
    setTimeLeftWeekSeconds(input);
  };

  return (
    <div className="container">
      <h1>{new Date().toLocaleDateString()}</h1>
      <Button
        active={timerOn}
        onClick={handleTimerToggle}
        label={timerOn ? "Stop working" : "Begin working"}
      />
      <TimerDisplay seconds={timeLeftWeekSeconds} message="Time left:" />
      <div>
        <h2 style={{ display: "inline-block", marginRight: 10 }}>
          Work Totals
        </h2>
        {timerOn ? <Button onClick={handleRefresh} label="Refresh" /> : null}
      </div>
      <WorkHistory
        totalTimeWorkedSeconds={totalTimeWorkedSeconds}
        onSave={handleSave}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
