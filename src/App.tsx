import { useMemo, useState } from "react";
import { WorkHistory } from "./components/WorkHistory/workHistory";
import { Clock } from "./components/clock";
import { Workday } from "./types/WorkHistory";

export default function App() {
  const [workday, setWorkday] = useState<Workday>();
  const [timeInLieu, setTimeInLieu] = useState(7.6 * 60 * 60);

  const workHistories: Workday[] = useMemo(() => {
    let histories = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.includes("-start")) continue;
      if (key.includes("-current")) continue;

      const item = Number.parseInt(localStorage.getItem(key) || "");
      histories.push({ date: key, time: item });
    }
    return histories;
  }, [workday]);

  const handleClockSave = (time: number) => {
    const localeDateString = new Date().toLocaleDateString();

    localStorage.setItem(localeDateString, time.toString());
    setWorkday({ date: localeDateString, time });
  };

  return (
    <>
      <h1>Punch Card</h1>
      <Clock
        timeInLieuInSeconds={timeInLieu}
        onSave={(time: number) => handleClockSave(time)}
      ></Clock>
      <WorkHistory
        workHistories={workHistories}
        onHistoryUpdate={(timeInLieu) => setTimeInLieu(timeInLieu)}
      ></WorkHistory>
    </>
  );
}
