import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./TimerDisplay.css";

interface TimeWorkedDisplayProps {
  timeWorkedSeconds: number;
}

export const TimeWorkedDisplay = (props: TimeWorkedDisplayProps) => {
  const [timeWorkedDisplay, setTimeWorkedDisplay] = useState("00:00:00");

  useEffect(() => {
    setTimeWorkedDisplay(
      convertSecondsToHoursMinutesSecondsString(props.timeWorkedSeconds)
    );
  }, [props]);

  return <div className="clock">{timeWorkedDisplay}</div>;
};
