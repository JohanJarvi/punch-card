import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./TimerDisplay.css";

interface TimerDisplayProps {
  seconds: number;
  message?: string;
}

export const TimerDisplay = (props: TimerDisplayProps) => {
  const [timerDisplay, setTimerDisplay] = useState("00:00:00");
  const [displayMessage, setDisplayMessage] = useState(props.message);

  useEffect(() => {
    if (props.seconds < 0) {
      setDisplayMessage("Overtime worked: ");

      setTimerDisplay(
        convertSecondsToHoursMinutesSecondsString(Math.abs(props.seconds))
      );
    } else {
      setDisplayMessage("Time left: ");
      setTimerDisplay(convertSecondsToHoursMinutesSecondsString(props.seconds));
    }
  }, [props]);

  return (
    <div>
      <p>
        <strong>{displayMessage}</strong>{" "}
        <span className="clock">{timerDisplay}</span>
      </p>
      {props.seconds < 0 ? (
        <p>You are now working overtime. Stop that!</p>
      ) : null}
    </div>
  );
};
