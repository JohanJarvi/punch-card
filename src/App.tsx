import { useMemo, useState } from "react";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { Clock } from "./components/Clock/clock";
import { Workday } from "./types/WorkHistory";
import { isValidDateKey } from "./utils/DateUtils";
import { HistoryEditor } from "./components/HistoryEditor/HistoryEditor";

export default function App() {
  const [clockSave, toggleClockSave] = useState(false);
  const [timeInLieu, setTimeInLieu] = useState(7.6 * 60 * 60);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [editing, setEditing] = useState<Workday>();

  const histories = useMemo(() => {
    let histories = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.includes("-start")) continue;
      if (key.includes("-current")) continue;

      if (!isValidDateKey(key)) continue;

      const item = Number.parseInt(localStorage.getItem(key) || "");
      histories.push({ date: key, time: item });
    }
    return histories;
  }, [clockSave, triggerRefresh]);

  const handleClockSave = (time: number) => {
    const localeDateString = new Date().toLocaleDateString();

    localStorage.setItem(localeDateString, time.toString());
    toggleClockSave(!clockSave);
  };

  const handleDelete = (day: Workday) => {
    localStorage.removeItem(day.date);
    setTriggerRefresh(!triggerRefresh);
  };

  const handleEdit = (day: Workday) => {
    setEditing(day);
  };

  const handleEditorClose = () => {
    setEditing(undefined);
  };

  const handleSave = (updatedWorkday: Workday) => {
    localStorage.setItem(updatedWorkday.date, updatedWorkday.time.toString());
    setTriggerRefresh(!triggerRefresh);
    handleEditorClose();
  };

  return (
    <div className="p-10 h-screen w-screen bg-slate-300 font-sans text-slate-900">
      <div className={`flex flex-col items-center ${editing && "blur"}`}>
        <h1 className="text-4xl text-slate-900 font-serif mb-5">Punch Card</h1>
        <Clock
          timeInLieuInSeconds={timeInLieu}
          onSave={(time: number) => handleClockSave(time)}
        ></Clock>
        <h2 className="text-3xl text-slate-900 font-serif my-5">
          Work History
        </h2>
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
  );
}
