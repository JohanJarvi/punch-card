import { useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../../utils/TimeConverter";

interface RemainingDisplayProps {
  timeLeftSeconds: number;
}

type DisplayStyle = "time" | "timePercentage" | "percentage";

type DisplayStyleNode = {
  curentDisplayStyle: DisplayStyle;
  nextDisplayStyle: DisplayStyle;
};

export const RemainingDisplay = ({
  timeLeftSeconds,
}: RemainingDisplayProps) => {
  const [displayStyle, setDisplayStyle] =
    useState<DisplayStyle>("timePercentage");

  const displayStyleNodes: DisplayStyleNode[] = [
    { curentDisplayStyle: "time", nextDisplayStyle: "percentage" },
    { curentDisplayStyle: "percentage", nextDisplayStyle: "timePercentage" },
    { curentDisplayStyle: "timePercentage", nextDisplayStyle: "time" },
  ];

  //   const absoluteTimeLeftSeconds = Math.abs(timeLeftSeconds);
  //   let timeLeftDisplay;
  //   if (timeLeftSeconds < 0) {
  //     timeLeftDisplay = `${convertSecondsToHoursMinutesSecondsString(
  //       absoluteTimeLeftSeconds
  //     )} overtime worked today`;
  //   } else {
  //     timeLeftDisplay = `${convertSecondsToHoursMinutesSecondsString(
  //       absoluteTimeLeftSeconds
  //     )} (${((absoluteTimeLeftSeconds / (7.6 * 60 * 60)) * 100).toFixed(
  //       2
  //     )}%) remains today`;
  //   }

  const finishDate = new Date();
  finishDate.setSeconds(finishDate.getSeconds() + timeLeftSeconds);

  const getTimeLeftDisplay = () => {
    const absoluteTimeLeftSeconds = Math.abs(timeLeftSeconds);
    const absoluteTimeLeftSecondsDisplay =
      convertSecondsToHoursMinutesSecondsString(Math.abs(timeLeftSeconds));
    const percentageLeft = (
      (absoluteTimeLeftSeconds / (7.6 * 60 * 60)) *
      100
    ).toFixed(2);

    switch (displayStyle) {
      case "time":
        return timeLeftSeconds < 0
          ? `${absoluteTimeLeftSecondsDisplay} overtime worked today`
          : `${absoluteTimeLeftSecondsDisplay} remains today`;

      case "timePercentage":
        return timeLeftSeconds < 0
          ? `${absoluteTimeLeftSecondsDisplay} (${percentageLeft}%) overtime worked today`
          : `${absoluteTimeLeftSecondsDisplay} (${percentageLeft}%) remains today`;

      case "percentage":
      default:
        return timeLeftSeconds < 0
          ? `${percentageLeft}% overtime worked today`
          : `${percentageLeft}% remains today`;
    }
  };

  const getNextDisplayStyle = () => {
    return (
      displayStyleNodes.find(
        (displayStyleNode) =>
          displayStyleNode.curentDisplayStyle === displayStyle
      )?.nextDisplayStyle || "time"
    );
  };

  return (
    <>
      <p>
        <h2>{getTimeLeftDisplay()}</h2>
        <button onClick={() => setDisplayStyle(getNextDisplayStyle())}>
          Toggle time remaining style
        </button>
      </p>
      <p>
        {finishDate < new Date()
          ? `You should have finished at ${finishDate.toLocaleTimeString()} on ${finishDate.toLocaleDateString()}`
          : `You should finish at ${finishDate.toLocaleTimeString()} on ${finishDate.toLocaleDateString()}`}
      </p>
    </>
  );
};
