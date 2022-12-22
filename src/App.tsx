import { useState } from "react";
import { Timer } from "./components/Timer/Timer";
import "./App.css";
import { TimeWorkedDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );

  const handleTimerTick = (increment: number): void => {
    const updatedTimeWorked = timeWorkedSeconds + increment;
    const date = new Date().toLocaleDateString();
    localStorage.setItem(date, updatedTimeWorked.toString());
    setTimeWorkedSeconds(updatedTimeWorked);
  };

  return (
    <div className="container">
      <Timer handleTimerTick={handleTimerTick} />
      <p>Time worked today:</p>
      <TimeWorkedDisplay timeWorkedSeconds={timeWorkedSeconds} />
      <WorkHistory timeWorkedSeconds={timeWorkedSeconds} />
    </div>
  );
}
