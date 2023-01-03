import { useState } from "react";
import { Timer } from "./components/Timer/Timer";
import "./App.css";
import { TimerDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

  const handleTimerTick = (increment: number): void => {
    const updatedTimeWorked = timeWorkedSeconds + increment;
    const date = new Date().toLocaleDateString();
    localStorage.setItem(date, updatedTimeWorked.toString());
    setTimeWorkedSeconds(updatedTimeWorked);
    const workDayInSeconds = 7.6*60*60;
    setTimeLeftSeconds(workDayInSeconds - updatedTimeWorked);
  };

  return (
    <div className="container">
      <Timer handleTimerTick={handleTimerTick} />
      <p>Time worked today:</p>
      <TimerDisplay seconds={timeWorkedSeconds} />
      <p>Time left today:</p>
      <TimerDisplay seconds={timeLeftSeconds} />
      <WorkHistory timeWorkedSeconds={timeWorkedSeconds} />
    </div>
  );
}
