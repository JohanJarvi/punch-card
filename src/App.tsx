import { useEffect, useState } from "react";
import { WorkHistory } from "./components/WorkHistory/WorkHistory";
import { Clock } from "./components/Clock/clock";
import { Workday } from "./types/WorkHistory";
import { isValidDateKey } from "./utils/DateUtils";

export default function App() {
  const [clockSave, toggleClockSave] = useState(false);
  const [timeInLieu, setTimeInLieu] = useState(7.6 * 60 * 60);
  const [histories, setHistories] = useState<Workday[]>([]);

  useEffect(() => {
    let histories = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.includes("-start")) continue;
      if (key.includes("-current")) continue;

      if (!isValidDateKey(key)) continue;

      const item = Number.parseInt(localStorage.getItem(key) || "");
      histories.push({ date: key, time: item });
    }
    setHistories(histories);
  }, [clockSave]);

  const handleClockSave = (time: number) => {
    const localeDateString = new Date().toLocaleDateString();

    localStorage.setItem(localeDateString, time.toString());
    toggleClockSave(!clockSave);
  };

  return (
    <div>
      <h1>Punch Card</h1>
      <Clock
        timeInLieuInSeconds={timeInLieu}
        onSave={(time: number) => handleClockSave(time)}
      ></Clock>
      <WorkHistory
        workHistories={histories}
        onHistoryUpdate={(timeInLieu) => setTimeInLieu(timeInLieu)}
      ></WorkHistory>
    </div>
  );
}
