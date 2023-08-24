import { useEffect } from "react";
import { HistoryWeek, Workday } from "../../types/WorkHistory";
import { getWeekNumberOfYearFromDateKey } from "../../utils/DateUtils";
import { WorkHistoryWeek } from "./WorkHistoryWeek/WorkHistoryWeek";

interface WorkHistoryProps {
  workHistories: Workday[];
  onHistoryUpdate: (timeInLieu: number) => void;
  onDelete: (day: Workday) => void;
}

export const WorkHistory = ({
  workHistories,
  onHistoryUpdate,
  onDelete,
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
  }, [historyWeeks, onHistoryUpdate]);

  const handleDelete = (day: Workday) => {
    onDelete(day);
  };

  return (
    <div className="flex flex-col w-1/3 gap-4">
      {historyWeeks
        .sort((a, b) => (a.week > b.week ? -1 : 1))
        .map((historyWeek) => {
          return (
            <WorkHistoryWeek
              key={historyWeek.week}
              week={historyWeek}
              onDelete={handleDelete}
            ></WorkHistoryWeek>
          );
        })}
    </div>
  );
};
