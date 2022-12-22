import { useEffect, useState } from "react";
import { Button } from "../Button/Button";

interface TimerProps {
  handleTimerTick: (increment: number) => void;
}

export const Timer = (props: TimerProps) => {
  const [toggleTimer, setToggleTimer] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (toggleTimer) {
      interval = setInterval(() => props.handleTimerTick(1), 1000);
    }

    return function cleanup() {
      clearInterval(interval);
    };
  }, [props, toggleTimer]);

  const handleTimerToggle = () => {
    const newTimerState = !toggleTimer;
    setToggleTimer(newTimerState);
  };

  return (
    <div>
      <Button active={toggleTimer} onClick={handleTimerToggle}>
        {toggleTimer ? "Stop" : "Start"}
      </Button>
    </div>
  );
};
