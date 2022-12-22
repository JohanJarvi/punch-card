import { useEffect, useState } from "react";
import { getEnumeratedWeekDayFromLocaleDateString } from "../../utils/DateUtils";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import "./WorkHistory.css";

type WorkHistoryDisplay = {
  date: string;
  workedTimeInSeconds: number;
};

interface Dictionary<T> {
  [Key: string]: T;
}

interface WorkHistoryProps {
  timeWorkedSeconds: number;
}

export const WorkHistory = (props: WorkHistoryProps) => {
  const [workHistories, setWorkHistories] = useState<
    Dictionary<WorkHistoryDisplay[]>
  >({});

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

    const totalMondays = histories
      .map((history) => getEnumeratedWeekDayFromLocaleDateString(history.date))
      .filter((enumeratedweekDay) => enumeratedweekDay === 1).length;

    let weeklyWorkHistories: Dictionary<WorkHistoryDisplay[]> = {};
    let sortedWorkHistoryDisplays: WorkHistoryDisplay[] = [];
    let mondays = totalMondays;
    const keys: string[] = [];
    histories.forEach((history) => {
      sortedWorkHistoryDisplays.push(history);
      if (getEnumeratedWeekDayFromLocaleDateString(history.date) === 1) {
        const key = `Week ${mondays}`;
        keys.push(key);
        weeklyWorkHistories[key] = sortedWorkHistoryDisplays;
        mondays -= 1;
        sortedWorkHistoryDisplays = [];
      }
    });

    setTotalTimeWorked(timeWorked);
    setWorkHistories(weeklyWorkHistories);
  }, [props]);

  return (
    <div>
      {Object.keys(workHistories).map((key) => {
        const weeklyTimeWorked = workHistories[key]
          .map((history) => history.workedTimeInSeconds)
          .reduce((a, b) => a + b);

        const values = workHistories[key].map((value) => {
          return (
            <tr key={value.date}>
              <td>{value.date}</td>
              <td>
                {convertSecondsToHoursMinutesSecondsString(
                  value.workedTimeInSeconds
                )}
              </td>
            </tr>
          );
        });

        return (
          <div key={key}>
            <p>{key}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Worked</th>
                </tr>
              </thead>
              <tbody>
                {values}
                <tr>
                  <td colSpan={2}>
                    <hr />
                    <strong>
                      Total time worked this week:{" "}
                      {convertSecondsToHoursMinutesSecondsString(
                        weeklyTimeWorked
                      )}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
      <p>
        Total time worked:{" "}
        {convertSecondsToHoursMinutesSecondsString(totalTimeWorked)}
      </p>
    </div>
  );
};
