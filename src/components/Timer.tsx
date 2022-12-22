import { useEffect, useState } from "react";

interface TimerProps {
  handleChange: (increment: number) => void;
}

export const Timer = (props: TimerProps) => {
  const [toggleTimer, setToggleTimer] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (toggleTimer) {
      interval = setInterval(() => props.handleChange(1), 1000);
    }

    return function cleanup() {
      clearInterval(interval);
    };
  }, [props, toggleTimer]);

  const handleTimerToggle = (event: any) => {
    setToggleTimer(!toggleTimer);
  };

  return (
    <div>
      <p>Tick tock</p>
      <button onClick={handleTimerToggle}>
        {toggleTimer ? "Stop" : "Start"}
      </button>
    </div>
  );
};
