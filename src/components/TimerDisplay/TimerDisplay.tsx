import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./TimerDisplay.css";

interface TimerDisplayProps {
  seconds: number;
  message?: string;
}

export const TimerDisplay = (props: TimerDisplayProps) => {
  const [timeWorkedDisplay, setTimeWorkedDisplay] = useState("00:00:00");

  useEffect(() => {
    setTimeWorkedDisplay(
      convertSecondsToHoursMinutesSecondsString(props.seconds)
    );
  }, [props]);

  return (
    <div>
      {props.seconds < 0 ? (
        <p>You are now working overtime. Stop that!</p>
      ) : (
        <p>
          <strong>{props.message}</strong>{" "}
          <span className="clock">{timeWorkedDisplay}</span>
        </p>
      )}
    </div>
  );
};
