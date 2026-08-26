import { useEffect, useState } from "react";
import duckSleepy from "../assets/duck-sleepy.png";
import duckAlert from "../assets/duck-alert.png";
import duckHappy from "../assets/duck-happy.png";

const TOTAL_DOTS = 5;
const EXPECTED_SECONDS = 60;

export default function WakingUpCard() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 500);
    return () => clearInterval(id);
  }, []);

  const filledDots = Math.min(
    TOTAL_DOTS,
    Math.max(1, Math.round((elapsed / EXPECTED_SECONDS) * TOTAL_DOTS))
  );
  const duck = filledDots >= 4 ? duckHappy : filledDots >= 2 ? duckAlert : duckSleepy;

  return (
    <div className="flex items-center gap-3 rounded-full border border-brand-100 bg-[#eef6ff] px-4 py-2.5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
        <img src={duck} alt="" className="h-9 w-9 object-contain" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">Waking up the server...</p>
        <p className="text-xs text-slate-500">This can take up to a minute.</p>
        <div className="mt-1 flex gap-1">
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i < filledDots ? "bg-amber-400" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
