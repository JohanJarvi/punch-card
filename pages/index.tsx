import { useMemo, useState } from "react";
import { WorkHistory } from "../components/WorkHistory/History";
import { Clock } from "../components/Timer/Clock";
import { isDayKey, toDayKey } from "../utils/DayKey";
import { migrateLegacyDayKeys } from "../utils/DayKeyMigration";
import { HistoryEditor } from "../components/HistoryEditor/HistoryEditor";
import { ExportCsvButton } from "../components/Export/ExportCsvButton";
import { DeleteOldHistory } from "../components/HistoryCleanup/DeleteOldHistory";
import { Workday } from "@/models/WorkHistory";
import Head from "next/head";
import { useAppContext } from "./_app";

export default function Home() {
  const { workDayLength } = useAppContext();

  const [clockSave, toggleClockSave] = useState(false);
  const [timeInLieu, setTimeInLieu] = useState(workDayLength * 60 * 60);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [editing, setEditing] = useState<Workday>();

  const localStorage =
    typeof window !== "undefined" ? window.localStorage : undefined;

  // Convert locale-formatted keys from older versions to ISO day keys. This
  // runs once, before anything below (or the Clock) reads from storage, and
  // is safe to repeat.
  useState(() => localStorage && migrateLegacyDayKeys(localStorage));

  const histories = useMemo(() => {
    const histories = [];

    if (!localStorage) return [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (!isDayKey(key)) continue;

      const item = Number.parseInt(localStorage.getItem(key) || "");
      histories.push({ date: key, time: item });
    }
    return histories;
  }, [clockSave, triggerRefresh]);

  const handleClockSave = (time: number) => {
    localStorage && localStorage.setItem(toDayKey(), time.toString());
    toggleClockSave(!clockSave);
  };

  const handleDelete = (day: Workday) => {
    localStorage && localStorage.removeItem(day.date);
    setTriggerRefresh(!triggerRefresh);
  };

  // Only the day entries are removed. The running clock's keys and the
  // legacy-key backup are left alone.
  const handleDeleteMany = (days: Workday[]) => {
    days.forEach((day) => localStorage && localStorage.removeItem(day.date));
    setTriggerRefresh(!triggerRefresh);
  };

  const handleEdit = (day: Workday) => {
    setEditing(day);
  };

  const handleEditorClose = () => {
    setEditing(undefined);
  };

  const handleSave = (updatedWorkday: Workday) => {
    localStorage &&
      localStorage.setItem(updatedWorkday.date, updatedWorkday.time.toString());
    setTriggerRefresh(!triggerRefresh);
    handleEditorClose();
  };

  return (
    <>
      <Head>
        <meta name="theme-color" content="#cbd5e1" />
      </Head>
      <div className="p-5 min-h-screen w-screen bg-slate-300 font-sans text-slate-900">
        <div className={`flex flex-col items-center ${editing && "blur"}`}>
          <h1 className="text-4xl text-slate-900 font-serif mb-5">
            Punch Card
          </h1>
          <Clock
            timeInLieuInSeconds={timeInLieu}
            onSave={(time: number) => handleClockSave(time)}
          ></Clock>
          {histories.length > 0 && (
            <h2 className="text-3xl text-slate-900 font-serif my-5">
              Work History
            </h2>
          )}
          {histories.length > 0 && (
            <div className="flex flex-row flex-wrap justify-center gap-3 mb-5">
              <ExportCsvButton workHistories={histories} />
              <DeleteOldHistory
                workHistories={histories}
                onDelete={handleDeleteMany}
              />
            </div>
          )}
          <WorkHistory
            workHistories={histories}
            onHistoryUpdate={(timeInLieu) => setTimeInLieu(timeInLieu)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          ></WorkHistory>
        </div>
        {editing && (
          <HistoryEditor
            workDayToEdit={editing}
            onClose={handleEditorClose}
            onSave={handleSave}
          ></HistoryEditor>
        )}
      </div>
    </>
  );
}
