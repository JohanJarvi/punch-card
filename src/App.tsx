import { useEffect, useState } from "react";
import "./App.css";
import { TimerDisplay } from "./components/TimerDisplay/TimerDisplay";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { Button } from "./components/Button/Button";

export default function App() {
  const dateToday = new Date().toLocaleDateString();
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(
    Number.parseInt(localStorage?.getItem(dateToday) || "0")
  );
  const [toggleTimer, setToggleTimer] = useState(true);

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (toggleTimer) {
      interval = setInterval(() => {
        setTimeWorkedSeconds((previousCount) => previousCount + 1);
      }, 1000);
    }

    return function cleanup() {
      clearInterval(interval);
    };
  }, [toggleTimer]);

  useEffect(() => {
    const date = new Date().toLocaleDateString();
    localStorage.setItem(date, timeWorkedSeconds.toString());

    const workDayInSeconds = 7.6 * 60 * 60;
    setTimeLeftSeconds(workDayInSeconds - timeWorkedSeconds);
  }, [timeWorkedSeconds]);

  const handleTimerToggle = () => setToggleTimer(!toggleTimer);

  return (
    <div className="container">
      <Button active={toggleTimer} onClick={handleTimerToggle}>
        {toggleTimer ? "Stop" : "Start"}
      </Button>
      <p>Time worked today:</p>
      <TimerDisplay seconds={timeWorkedSeconds} />
      <p>Time left today:</p>
      <TimerDisplay seconds={timeLeftSeconds} />
      <WorkHistory timeWorkedSeconds={timeWorkedSeconds} />
    </div>
  );
}
