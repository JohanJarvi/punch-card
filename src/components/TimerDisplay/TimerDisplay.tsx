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
      {props.seconds > 0 ? (
        <div>
          <p>
            <strong>{props.message}</strong>
          </p>
          <div className="clock">{timeWorkedDisplay}</div>
        </div>
      ) : null}
    </div>
  );
};
