import { useEffect } from "react";
import { WorkHistoryWeek } from "./HistoryWeek";
import { HistoryYear, Workday } from "@/models/WorkHistory";
import { useAppContext } from "@/pages/_app";
import { DateTime } from "luxon";

interface WorkHistoryProps {
  workHistories: Workday[];
  onHistoryUpdate: (timeInLieu: number) => void;
  onDelete: (day: Workday) => void;
  onEdit: (day: Workday) => void;
}

export const WorkHistory = ({
  workHistories,
  onHistoryUpdate,
  onDelete,
  onEdit,
}: WorkHistoryProps) => {
  const { workDayLength } = useAppContext();

  const uniqueYears = Array.from(
    new Set(
      workHistories.map(
        (history) => DateTime.fromFormat(history.date, "d/m/yyyy").year
      )
    )
  ).sort((a, b) => (a > b ? -1 : 1));

  const calculateTimeLeftInWeek = (weeklyHistories: Workday[]): number => {
    const lieuTimeWeek = weeklyHistories
      .map((history) => workDayLength * 60 * 60 - history.time)
      .reduce((a, b) => a + b);

    return lieuTimeWeek;
  };

  const historyYears: HistoryYear[] = uniqueYears.map((year) => {
    const yearlyHistories = workHistories.filter(
      (workHistory) =>
        DateTime.fromFormat(workHistory.date, "d/M/yyyy").year === year
    );

    const uniqueYearlyWeeks = Array.from(
      new Set(
        yearlyHistories.map(
          (history) => DateTime.fromFormat(history.date, "d/M/yyyy").weekNumber
        )
      )
    );

    return {
      year,
      histories: uniqueYearlyWeeks.map((week) => {
        const weeklyHistories = yearlyHistories.filter(
          (workHistory) =>
            DateTime.fromFormat(workHistory.date, "d/M/yyyy").weekNumber ===
            week
        );

        return {
          week,
          histories: weeklyHistories.sort((a, b) =>
            DateTime.fromFormat(a.date, "d/M/yyyy") >
            DateTime.fromFormat(b.date, "d/M/yyyy")
              ? -1
              : 1
          ),
          lieuTime: calculateTimeLeftInWeek(weeklyHistories),
        };
      }),
    };
  });

  useEffect(() => {
    if (historyYears.length === 0) return;

    const totalLieuTime = historyYears
      .flatMap((historyYear) => historyYear.histories)
      .map((historyWeek) => historyWeek.lieuTime)
      .reduce((a, b) => a + b);

    onHistoryUpdate(totalLieuTime);
  }, [historyYears, onHistoryUpdate]);

  const handleDelete = (day: Workday) => {
    onDelete(day);
  };

  const handleEdit = (day: Workday) => {
    onEdit(day);
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-3/4 2xl:w-1/3 mb-10">
      {historyYears.map((historyYear) => {
        return (
          <div
            key={historyYear.year}
            className="flex flex-col my-2 p-5 bg-slate-200 drop-shadow-lg rounded-lg gap-4"
          >
            <div className="flex text-2xl font-mono">{historyYear.year}</div>
            {historyYear.histories
              .sort((a, b) => (a.week > b.week ? -1 : 1))
              .map((historyWeek) => {
                return (
                  <WorkHistoryWeek
                    key={historyWeek.week}
                    week={historyWeek}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  ></WorkHistoryWeek>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};
