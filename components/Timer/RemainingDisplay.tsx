import { useState } from "react";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";
import { useAppContext } from "@/pages/_app";

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
  const { workDayLength } = useAppContext();

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
      (absoluteTimeLeftSeconds / (workDayLength * 60 * 60)) *
      100
    ).toFixed(percentageDecimals);

    switch (displayStyle) {
      case "time":
        return timeLeftSeconds < 0
          ? `${absoluteTimeLeftSecondsDisplay} overtime today`
          : `${absoluteTimeLeftSecondsDisplay} remains today`;

      case "timePercentage":
        return timeLeftSeconds < 0
          ? `${absoluteTimeLeftSecondsDisplay} (${percentageLeft}%) overtime today`
          : `${absoluteTimeLeftSecondsDisplay} (${percentageLeft}%) remains today`;

      case "percentage":
      default:
        return timeLeftSeconds < 0
          ? `${percentageLeft}% overtime today`
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
          className="bg-slate-400 rounded-lg drop-shadow-md w-10 h-8 hover:bg-slate-300 flex justify-center items-center"
          onClick={() => setShowConfig(!showConfig)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
      {showConfig && (
        <div className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg">
          <button
            className="bg-slate-400 rounded-lg drop-shadow-md w-10 h-8 hover:bg-slate-300 flex justify-center items-center self-center"
            onClick={() => setShowConfig(!showConfig)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-slate-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="flex justify-center font-bold font-mono my-5 text-xl">
            Configuration
          </h2>
          <div className="flex flex-col items-center my-2 justify-around gap-4 md:flex-row">
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
