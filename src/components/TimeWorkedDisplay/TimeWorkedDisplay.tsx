import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";

interface TimeWorkedDisplayProps {
  timeWorkedSeconds: number;
}

export const TimeWorkedDisplay = (props: TimeWorkedDisplayProps) => {
  const [timeWorkedDisplay, setTimeWorkedDisplay] = useState("00:00:00");

  useEffect(() => {
    convertSecondsToHoursMinutesSecondsString(props.timeWorkedSeconds);
  }, [props]);

  return <div>{timeWorkedDisplay}</div>;
};
