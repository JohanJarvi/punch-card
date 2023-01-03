import React, { useEffect, useState } from "react";
import { Button } from "../../Button/Button";
import { ScreenCoordinates, WorkHistoryDisplay } from "../WorkHistory";
import "./Editor.css";

interface EditorProps {
  editing: boolean;
  dateToBeEdited: string;
  weekNumber: number;
  positionCoordinates?: ScreenCoordinates;
  handleEditedWorkHistory: (editedWorkHistory: WorkHistoryDisplay) => void;
  handleClose: (closed: boolean) => void;
}

export const Editor = (props: EditorProps) => {
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleHoursChanged = (event: React.ChangeEvent<HTMLInputElement>) =>
    setHours(Number.parseInt(event.target.value) || 0);
  const handleMinutesChanged = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMinutes(Number.parseInt(event.target.value) || 0);
  const handleSecondsChanged = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSeconds(Number.parseInt(event.target.value) || 0);

  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    }
  }, [hours, minutes, seconds]);

  const handleSave = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    props.handleEditedWorkHistory({
      date: props.dateToBeEdited,
      workedTimeInSeconds: totalSeconds,
      weekNumber: props.weekNumber
    });

    (document.getElementById("hours") as any).value = "";
    (document.getElementById("minutes") as any).value = "";
    (document.getElementById("seconds") as any).value = "";

    setHours(0);
    setMinutes(0);
    setSeconds(0);

    props.handleClose(true);
  };

  return props.editing ? (
    <div
      className="modal"
      style={{
        left: props.positionCoordinates?.x,
        top: props.positionCoordinates?.y,
      }}
    >
      <div className="main-flex-container">
        <div className="flex-item">
          Editing work hours for {props.dateToBeEdited}{" "}
        </div>
        <div
          className="flex-item"
          onClick={() => props.handleClose(true)}
          style={{ cursor: "pointer" }}
        >
          <strong>X</strong>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">Hours</div>
        <div className="flex-item">
          <input id="hours" type="number" onChange={handleHoursChanged} />
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">Minutes</div>
        <div className="flex-item">
          <input id="minutes" type="number" onChange={handleMinutesChanged} />
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">Seconds</div>
        <div className="flex-item">
          <input id="seconds" type="number" onChange={handleSecondsChanged} />
        </div>
      </div>
      {saveDisabled ? null : (
        <div className="save-button">
          <Button active={false} onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  ) : null;
};
