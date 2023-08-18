import { HistoryWeek } from "../../../types/WorkHistory";
import { WorkHistoryDay } from "./WorkHistoryDay/WorkHistoryDay";

interface WorkHistoryWeekProps {
  week: HistoryWeek;
}

export const WorkHistoryWeek = ({ week }: WorkHistoryWeekProps) => {
  return (
    <>
      <h2>Week {week.week}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {week.histories.map((historyDay) => {
            return (
              <WorkHistoryDay
                key={historyDay.date}
                day={historyDay}
              ></WorkHistoryDay>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
