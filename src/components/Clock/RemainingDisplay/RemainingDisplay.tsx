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

  const [showConfig, setShowConfig] = useState(false);

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
    if (percentageDecimals === 1) return;

    setPercentageDecimals(percentageDecimals - 1);
  };

  const incrementPercentageDecimalPlaces = () => {
    if (percentageDecimals === 6) return;

    setPercentageDecimals(percentageDecimals + 1);
  };

  const getReadableDisplayStyle = (displayStyle: DisplayStyle): string => {
    switch (displayStyle) {
      case "percentage":
        return "Percentage";
      case "time":
        return "Time";
      case "timePercentage":
        return "Time & Percentage";
      default:
        return "Unknown";
    }
  };

  const getStylisedCurrentStyle = (displayStyle: DisplayStyle): string => {
    switch (displayStyle) {
      case "percentage":
        return `0.${"0".repeat(percentageDecimals)}%`;
      case "time":
        return "HH:mm:ss";
      case "timePercentage":
        return `HH:mm:ss (0.${"0".repeat(percentageDecimals)}%)`;
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg items-center">
        <div className="flex flex-row">
          <h2 className="flex font-bold font-mono mb-5 text-xl">Remainder</h2>
        </div>
        <p className="text-md md:text-lg lg:text-xl xl:text-2xl">
          {getTimeLeftDisplay()}
        </p>
        <p className="text-xs md:text-sm lg:text-base xl:text-xl mb-5">
          {finishDate < new Date()
            ? `You should've finished at ${finishDate.toLocaleTimeString()}, ${finishDate.toLocaleDateString()}`
            : `You should finish at ${finishDate.toLocaleTimeString()}, ${finishDate.toLocaleDateString()}`}
        </p>
        <button
          className="bg-slate-400 rounded-t-lg drop-shadow-md w-10 h-5 hover:bg-slate-300 absolute bottom-0"
          onClick={() => setShowConfig(!showConfig)}
        ></button>
      </div>
      {showConfig && (
        <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg">
          <button
            className="bg-slate-400 rounded-b-lg drop-shadow-md w-10 h-5 hover:bg-slate-300 absolute top-0 flex self-center justify-center"
            onClick={() => setShowConfig(!showConfig)}
          ></button>
          <h2 className="flex justify-center font-bold font-mono my-5 text-xl">
            Configuration
          </h2>
          <div className="flex flex-row items-center my-2 justify-around">
            <div className="flex flex-col items-center gap-2 w-fit md:w-64">
              <span className="md:text-lg">
                {getStylisedCurrentStyle(displayStyle)}
              </span>
              <button
                className="bg-slate-400 rounded-full px-5 drop-shadow-md hover:bg-slate-300 h-12 w-36 md:w-48"
                onClick={() => setDisplayStyle(getNextDisplayStyle())}
              >
                {getReadableDisplayStyle(displayStyle)}
              </button>
            </div>
            {(displayStyle === "percentage" ||
              displayStyle === "timePercentage") && (
              <div className="flex flex-col items-center gap-2 w-fit md:w-64">
                <span className="md:text-lg">
                  {"0." + "0".repeat(percentageDecimals)}%
                </span>
                <div className="font-mono">
                  <button
                    className="bg-slate-400 rounded-full drop-shadow-md w-12 h-12 hover:bg-slate-300"
                    onClick={decrementPercentageDecimalPlaces}
                  >
                    -
                  </button>
                  {"/"}
                  <button
                    className="bg-slate-400 rounded-full drop-shadow-md w-12 h-12 hover:bg-slate-300"
                    onClick={incrementPercentageDecimalPlaces}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
