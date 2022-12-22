import { useEffect, useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";

type WorkHistoryDisplay = {
  date: string;
  workedTimeInSeconds: number;
};

export const WorkHistory = () => {
  const [workHistories, setWorkHistories] = useState<WorkHistoryDisplay[]>([]);

  useEffect(() => {
    const histories: WorkHistoryDisplay[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      const item = localStorage.getItem(key);

      histories.push({
        date: key,
        workedTimeInSeconds: Number.parseInt(item || ""),
      });
    }

    histories.sort((a, b) => (a.date > b.date ? -1 : 1));
    setWorkHistories(histories);
  }, []);

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
    </div>
  ) : null;
};
