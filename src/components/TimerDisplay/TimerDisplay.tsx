import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./TimerDisplay.css";

interface TimerDisplayProps {
  seconds: number;
}

export const TimerDisplay = (props: TimerDisplayProps) => {
  const [timeWorkedDisplay, setTimeWorkedDisplay] = useState("00:00:00");

  useEffect(() => {
    setTimeWorkedDisplay(
      convertSecondsToHoursMinutesSecondsString(props.seconds)
    );
  }, [props]);

  return <div className="clock">{timeWorkedDisplay}</div>;
};
