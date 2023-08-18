import { Workday } from "../../../../types/WorkHistory";
import { convertSecondsToHoursMinutesSecondsString } from "../../../../utils/TimeConverter";

interface WorkHistoryDayProps {
  day: Workday;
}

export const WorkHistoryDay = ({ day }: WorkHistoryDayProps) => {
  return (
    <>
      <tr>
        <td>
          <strong>{day.date}</strong>{" "}
        </td>
        <td>
          <em>{convertSecondsToHoursMinutesSecondsString(day.time)}</em>
        </td>
      </tr>
    </>
  );
};
