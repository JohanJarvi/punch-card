import { useEffect } from "react";
import { Workday } from "../../types/WorkHistory";
import { getWeekNumberOfYearFromDateKey } from "../../utils/DateUtils";
import { convertSecondsToHoursMinutesSecondsString } from "../../utils/TimeConverter";

interface WorkHistoryProps {
  workHistories: Workday[];
  onHistoryUpdate: (timeInLieu: number) => void;
}

type HistoryWeek = {
  week: number;
  histories: Workday[];
  lieuTime: number;
};

export const WorkHistory = ({
  workHistories,
  onHistoryUpdate,
}: WorkHistoryProps) => {
  const uniqueWeeks = Array.from(
    new Set(
      workHistories.map((history) =>
        getWeekNumberOfYearFromDateKey(history.date)
      )
    )
  );

  const calculateTimeLeftInWeek = (weeklyHistories: Workday[]): number => {
    const lieuTimeWeek = weeklyHistories
      .map((history) => 7.6 * 60 * 60 - history.time)
      .reduce((a, b) => a + b);

    return lieuTimeWeek;
  };

  const historyWeeks: HistoryWeek[] = uniqueWeeks.map((week) => {
    const weeklyHistories = workHistories.filter(
      (workHistory) => getWeekNumberOfYearFromDateKey(workHistory.date) === week
    );
    return {
      week,
      histories: weeklyHistories.sort((a, b) => (a.date > b.date ? -1 : 1)),
      lieuTime: calculateTimeLeftInWeek(weeklyHistories),
    };
  });

  useEffect(() => {
    if (historyWeeks.length === 0) return;

    const totalLieuTime = historyWeeks
      .map((historyWeek) => historyWeek.lieuTime)
      .reduce((a, b) => a + b);
    onHistoryUpdate(totalLieuTime);
  }, [historyWeeks]);

  return (
    <>
      {historyWeeks.map((historyWeek) => {
        return (
          <div key={historyWeek.week}>
            <p>{historyWeek.week}</p>
            {historyWeek.histories.map((history) => {
              return (
                <p key={history.date}>
                  {history.date}:{" "}
                  {convertSecondsToHoursMinutesSecondsString(history.time)}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
