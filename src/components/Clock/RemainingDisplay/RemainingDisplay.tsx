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

  const [percentageDecimals, setPercentageDecimals] = useState(2);

  const displayStyleNodes: DisplayStyleNode[] = [
    { curentDisplayStyle: "time", nextDisplayStyle: "percentage" },
    { curentDisplayStyle: "percentage", nextDisplayStyle: "timePercentage" },
    { curentDisplayStyle: "timePercentage", nextDisplayStyle: "time" },
  ];

  const finishDate = new Date();
  finishDate.setSeconds(finishDate.getSeconds() + timeLeftSeconds);

  const getTimeLeftDisplay = () => {
    const absoluteTimeLeftSeconds = Math.abs(timeLeftSeconds);
    const absoluteTimeLeftSecondsDisplay =
      convertSecondsToHoursMinutesSecondsString(Math.abs(timeLeftSeconds));
    const percentageLeft = (
      (absoluteTimeLeftSeconds / (7.6 * 60 * 60)) *
      100
    ).toFixed(percentageDecimals);

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

  const decrementPercentageDecimalPlaces = () => {
    if (percentageDecimals > 0) setPercentageDecimals(percentageDecimals - 1);
    return;
  };

  const incrementPercentageDecimalPlaces = () => {
    if (percentageDecimals < 11) setPercentageDecimals(percentageDecimals + 1);
    return;
  };

  return (
    <>
      <p>
        <h2>{getTimeLeftDisplay()}</h2>
        <button onClick={() => setDisplayStyle(getNextDisplayStyle())}>
          Toggle time remaining style
        </button>
        {(displayStyle === "percentage" ||
          displayStyle === "timePercentage") && (
          <div>
            Percentage decimal places:{" "}
            <button onClick={decrementPercentageDecimalPlaces}>-</button>
            {"/"}
            <button onClick={incrementPercentageDecimalPlaces}>+</button>
          </div>
        )}
      </p>
      <p>
        {finishDate < new Date()
          ? `You should have finished at ${finishDate.toLocaleTimeString()} on ${finishDate.toLocaleDateString()}`
          : `You should finish at ${finishDate.toLocaleTimeString()} on ${finishDate.toLocaleDateString()}`}
      </p>
    </>
  );
};
