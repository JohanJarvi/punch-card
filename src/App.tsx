import { useState } from "react";
import { Timer } from "./components/Timer";
import "./App.css";

export default function App() {
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(0);

  const handleChange = (increment: number): void => {
    setTimeWorkedSeconds(timeWorkedSeconds + 1);
  };

  return (
    <div className="container">
      <Timer handleChange={handleChange} />
      <p>{timeWorkedSeconds}</p>
    </div>
  );
}
