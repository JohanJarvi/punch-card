import { useEffect, useState } from "react";
import { getWeekNumberOfYearFromDateKey } from "../../utils/DateUtils";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import { Button } from "../Button/Button";
import { Editor } from "./Editor/Editor";
import "./WorkHistory.css";

export type WorkHistoryDisplay = {
  date: string;
  workedTimeInSeconds: number;
  weekNumber: number;
};

interface WorkHistoryProps {
  timeWorkedSeconds: number;
  onSave: () => void;
  onEdit: () => void;
}

interface WorkHistoryWeek {
  week: number;
  histories: WorkHistoryDisplay[];
  totalTimeWorkedInSeconds: number;
}

export interface ScreenCoordinates {
  x: number;
  y: number;
}

export const WorkHistory = (props: WorkHistoryProps) => {
  const [workHistories, setWorkHistories] = useState<WorkHistoryWeek[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dateToEdit, setDateToEdit] = useState("");
  const [weekNumberOFEdit, setWeekNumberOfEdit] = useState(0);
  const [clickCoordinates, setClickCoordinates] = useState<ScreenCoordinates>();

  useEffect(() => {
    const histories: WorkHistoryDisplay[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.includes("-total")) {
        const item = Number.parseInt(localStorage.getItem(key) || "");

        const sanitisedKey = key.replace("-total", "");

        histories.push({
          date: sanitisedKey,
          workedTimeInSeconds: item,
          weekNumber: getWeekNumberOfYearFromDateKey(sanitisedKey),
        });
      }
    }

    histories.sort((a, b) => (a.date > b.date ? -1 : 1));

    const uniqueWeeks = Array.from(
      new Set(histories.map((history) => history.weekNumber))
    );

    const workHistoryWeeks: WorkHistoryWeek[] = uniqueWeeks.map((week) => {
      const filteredHistories = histories.filter(
        (history) => history.weekNumber === week
      );
      const totalTimeWorkedInSeconds = filteredHistories
        .map((history) => history.workedTimeInSeconds)
        .reduce((a, b) => a + b);

      return { week, histories: filteredHistories, totalTimeWorkedInSeconds };
    });

    workHistoryWeeks.sort((a, b) => (a.week > b.week ? -1 : 1));

    setWorkHistories(workHistoryWeeks);
  }, [props]);

  const handleEdit = (event: any, dateToEdit: string, weekNumber: number) => {
    setShowEdit(true);
    setDateToEdit(dateToEdit);
    setWeekNumberOfEdit(weekNumber);
    setClickCoordinates({ x: event.pageX + 100, y: event.pageY });
    if (dateToEdit.includes(new Date().toLocaleDateString())) {
      props.onEdit();
    }
  };

  const handleClosed = (closed: boolean) => {
    setShowEdit(!closed);
    props.onSave();
  };

  const handleEditedWorkHistory = (editedWorkHistory: WorkHistoryDisplay) => {
    localStorage.setItem(
      editedWorkHistory.date,
      editedWorkHistory.workedTimeInSeconds.toString()
    );
  };

  const handleDelete = (event: any, key: string) => {
    localStorage.removeItem(`${key}-total`);

    const newHistories = workHistories
      .map((workHistoryWeek) => ({
        week: workHistoryWeek.week,
        histories: workHistoryWeek.histories.filter(
          (history) => !history.date.includes(key)
        ),
        totalTimeWorkedInSeconds: workHistoryWeek.totalTimeWorkedInSeconds,
      }))
      .filter((workHistoryWeek) => workHistoryWeek.histories.length > 0);

    setWorkHistories(newHistories);
  };

  return (
    <div>
      <Editor
        editing={showEdit}
        dateToBeEdited={`${dateToEdit}-total`}
        weekNumber={weekNumberOFEdit}
        positionCoordinates={clickCoordinates}
        handleEditedWorkHistory={handleEditedWorkHistory}
        handleClose={handleClosed}
        handleSave={props.onSave}
      />
      {workHistories.map((workHistory) => {
        return (
          <div key={workHistory.week}>
            <h3>
              Week {workHistory.week} (
              {workHistory.histories[0].date.substring(6, 10)})
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Worked</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workHistory.histories.map((history) => (
                  <tr key={history.date}>
                    <td>{history.date}</td>
                    <td>
                      {convertSecondsToHoursMinutesSecondsString(
                        history.workedTimeInSeconds
                      )}
                    </td>
                    <td>
                      <Button
                        onClick={(event) =>
                          handleEdit(event, history.date, history.weekNumber)
                        }
                        label="Edit"
                      />
                    </td>
                    <td>
                      <Button
                        onClick={(event) => handleDelete(event, history.date)}
                        label="Delete"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ borderTop: "1px solid black" }}>Week total</td>
                  <td style={{ borderTop: "1px solid black" }} colSpan={3}>
                    <strong>
                      {convertSecondsToHoursMinutesSecondsString(
                        workHistory.totalTimeWorkedInSeconds
                      )}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
