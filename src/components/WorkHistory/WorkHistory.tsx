import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";

type WorkHistoryDisplay = {
  date: string;
  workedTimeInSeconds: number;
};

interface WorkHistoryProps {
  timeWorkedSeconds: number;
}

export const WorkHistory = (props: WorkHistoryProps) => {
  const [workHistories, setWorkHistories] = useState<WorkHistoryDisplay[]>([]);
  const [totalTimeWorked, setTotalTimeWorked] = useState(0);

  useEffect(() => {
    const histories: WorkHistoryDisplay[] = [];
    let timeWorked = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      const item = Number.parseInt(localStorage.getItem(key) || "");

      timeWorked += item;

      histories.push({
        date: key,
        workedTimeInSeconds: item,
      });
    }

    histories.sort((a, b) => (a.date > b.date ? -1 : 1));

    setTotalTimeWorked(timeWorked);
    setWorkHistories(histories);
  }, [props]);

  return workHistories.length > 0 ? (
    <div>
      <h3>Work History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Worked</th>
          </tr>
        </thead>
        <tbody>
          {workHistories.map((workHistory) => {
            return (
              <tr key={workHistory.date}>
                <td>{workHistory.date}</td>

                <td>
                  {convertSecondsToHoursMinutesSecondsString(
                    workHistory.workedTimeInSeconds
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Total time worked:{" "}
        {convertSecondsToHoursMinutesSecondsString(totalTimeWorked)}
      </p>
    </div>
  ) : null;
};
