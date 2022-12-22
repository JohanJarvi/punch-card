import { useState } from "react";
import { Timer } from "./components/Timer/Timer";
import "./App.css";
import { TimeWorkedDisplay } from "./components/TimerDisplay/TimerDisplay";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );

  const handleTimerTick = (increment: number): void => {
    setTimeWorkedSeconds(timeWorkedSeconds + increment);
  };

  const handleTimerState = (running: boolean): void => {
    if (!running) {
      const date = new Date().toLocaleDateString();
      console.log(
        `Storing time worked today in seconds in this format ${date}: ${timeWorkedSeconds}`
      );
      localStorage.setItem(date, timeWorkedSeconds.toString());
    }
  };

  return (
    <div className="container">
      <Timer
        handleTimerTick={handleTimerTick}
        handleTimerState={handleTimerState}
      />
      <p>Time worked today:</p>
      <TimeWorkedDisplay timeWorkedSeconds={timeWorkedSeconds} />
    </div>
  );
}
