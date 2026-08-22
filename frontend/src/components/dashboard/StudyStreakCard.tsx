import { Flame } from "lucide-react";

interface StudyStreakCardProps {
  current?: number;
  best?: number;
  loading?: boolean;
}

export default function StudyStreakCard({ current, best, loading = false }: StudyStreakCardProps = {}) {
  const hasRealData = current !== undefined;
  const displayCurrent = loading ? "…" : hasRealData ? current : 12;
  const displayBest = loading ? "…" : hasRealData ? best : 28;

  return (
    <div className="flex flex-col rounded-2xl border border-sky-100 bg-sky-50 p-5">
      <p className="text-sm font-medium text-slate-500">Study Streak</p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">{displayCurrent}</span>
        <span className="text-sm text-slate-400">days</span>
      </div>

      <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
          <Flame size={32} className="fill-sky-600 text-sky-600" />
        </div>
        <p className="text-xs text-slate-400">
          {hasRealData && !loading && best === 0 ? "Start a study session to begin" : `Best: ${displayBest} days`}
        </p>
      </div>
    </div>
  );
}
