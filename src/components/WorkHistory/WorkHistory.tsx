import { useEffect, useState } from "react";
import { getEnumeratedWeekDayFromLocaleDateString } from "../../utils/DateUtils";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import { Button } from "../Button/Button";
import { Editor } from "./Editor/Editor";
import "./WorkHistory.css";

export type WorkHistoryDisplay = {
  date: string;
  workedTimeInSeconds: number;
};

interface Dictionary<T> {
  [Key: string]: T;
}

interface WorkHistoryProps {
  timeWorkedSeconds: number;
}

export interface ScreenCoordinates {
  x: number;
  y: number;
}

export const WorkHistory = (props: WorkHistoryProps) => {
  const [workHistories, setWorkHistories] = useState<
    Dictionary<WorkHistoryDisplay[]>
  >({});
  const [totalTimeWorked, setTotalTimeWorked] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [dateToEdit, setDateToEdit] = useState("");
  const [clickCoordinates, setClickCoordinates] = useState<ScreenCoordinates>();

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

  const handleEdit = (event: any, dateToEdit: string) => {
    setShowEdit(true);
    setDateToEdit(dateToEdit);
    setClickCoordinates({ x: event.pageX + 100, y: event.pageY });
  };

  const handleClosed = (closed: boolean) => setShowEdit(!closed);

  const handleEditedWorkHistory = (editedWorkHistory: WorkHistoryDisplay) => {
    localStorage.setItem(
      editedWorkHistory.date,
      editedWorkHistory.workedTimeInSeconds.toString()
    );
  };

  return (
    <div>
      <Editor
        editing={showEdit}
        dateToBeEdited={dateToEdit}
        positionCoordinates={clickCoordinates}
        handleEditedWorkHistory={handleEditedWorkHistory}
        handleClose={handleClosed}
      />
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
              <td>
                <Button onClick={(event) => handleEdit(event, value.date)}>
                  Edit
                </Button>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {values}
                <tr>
                  <td colSpan={3}>
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
