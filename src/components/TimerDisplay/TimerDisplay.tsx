import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./TimerDisplay.css";

type TimeLeftPercentage = {
  showTimeLeftPercentage: boolean;
  setPointInSeconds: number;
};

interface TimerDisplayProps {
  seconds: number;
  message?: string;
  timeLeftPercentage?: TimeLeftPercentage;
}

export const TimerDisplay = (props: TimerDisplayProps) => {
  const [timerDisplay, setTimerDisplay] = useState("00:00:00");
  const [displayMessage, setDisplayMessage] = useState(props.message);
  const [percentageRemaining, setPercentageRemaining] = useState<number>(0);

  useEffect(() => {
    if (props.seconds < 0) {
      setDisplayMessage("Overtime worked: ");

      setTimerDisplay(
        convertSecondsToHoursMinutesSecondsString(
          Math.abs(Math.round(props.seconds))
        )
      );
    } else {
      setDisplayMessage("Time left: ");
      setTimerDisplay(
        convertSecondsToHoursMinutesSecondsString(Math.round(props.seconds))
      );
    }

    if (props.timeLeftPercentage?.showTimeLeftPercentage) {
      if (props.seconds > 0) {
        setPercentageRemaining(
          (props.seconds / props.timeLeftPercentage.setPointInSeconds) * 100
        );
      } else {
        setPercentageRemaining(0);
      }
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
      {props.timeLeftPercentage?.showTimeLeftPercentage ? (
        <p>
          <em>{percentageRemaining.toFixed(4)}% left today</em>
        </p>
      ) : null}
    </div>
  );
};
