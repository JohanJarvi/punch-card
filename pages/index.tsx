import { useState } from "react";
import { WorkHistory } from "../components/WorkHistory/History";
import { Clock } from "../components/Timer/Clock";
import { toDayKey } from "../utils/DayKey";
import { migrateLegacyDayKeys } from "../utils/DayKeyMigration";
import { readWorkdays, storage } from "../utils/Storage";
import { HistoryEditor } from "../components/HistoryEditor/HistoryEditor";
import { ExportCsvButton } from "../components/Export/ExportCsvButton";
import { DeleteOldHistory } from "../components/HistoryCleanup/DeleteOldHistory";
import { Workday } from "@/models/WorkHistory";
import Head from "next/head";
import { useAppContext } from "./_app";

export default function Home() {
  const { workDayLength } = useAppContext();

  const [timeInLieu, setTimeInLieu] = useState(workDayLength * 60 * 60);
  const [editing, setEditing] = useState<Workday>();

  // Convert locale-formatted keys from older versions to ISO day keys, then
  // read the history. The conversion runs once, before anything (including
  // the Clock) reads from storage, and is safe to repeat.
  const [histories, setHistories] = useState<Workday[]>(() => {
    if (storage) migrateLegacyDayKeys(storage);
    return readWorkdays(storage);
  });

  const refreshHistories = () => setHistories(readWorkdays(storage));

  const handleClockSave = (time: number) => {
    storage?.setItem(toDayKey(), time.toString());
    refreshHistories();
  };

  const handleDelete = (day: Workday) => {
    storage?.removeItem(day.date);
    refreshHistories();
  };

  // Only the day entries are removed. The running clock's keys and the
  // legacy-key backup are left alone.
  const handleDeleteMany = (days: Workday[]) => {
    days.forEach((day) => storage?.removeItem(day.date));
    refreshHistories();
  };

  const handleEdit = (day: Workday) => {
    setEditing(day);
  };

  const handleEditorClose = () => {
    setEditing(undefined);
  };

  const handleSave = (updatedWorkday: Workday) => {
    storage?.setItem(updatedWorkday.date, updatedWorkday.time.toString());
    refreshHistories();
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
