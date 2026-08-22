import { CheckCircle2, Clock } from "lucide-react";

interface StudyProgressCardProps {
  completedMinutes?: number;
  goalMinutes?: number;
  percent?: number;
  loading?: boolean;
}

function formatHours(minutes: number): string {
  const hours = minutes / 60;
  return hours >= 1 ? `${hours.toFixed(1)}h` : `${minutes}m`;
}

export default function StudyProgressCard({ completedMinutes, goalMinutes, percent, loading = false }: StudyProgressCardProps = {}) {
  const hasRealData = percent !== undefined;
  const displayPercent = loading ? 0 : hasRealData ? percent! : 68;

  const message = !hasRealData
    ? { title: "Great job!", body: "You're on track to reach your goal." }
    : displayPercent >= 100
      ? { title: "Goal reached!", body: "You've hit your weekly study goal." }
      : displayPercent >= 50
        ? { title: "Great job!", body: "You're on track to reach your goal." }
        : { title: "Keep going", body: "Log a study session to make progress." };

  return (
    <div className="flex flex-col rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
      <p className="text-sm font-medium text-slate-500">Study Progress</p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">{loading ? "…" : `${displayPercent}%`}</span>
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
        {hasRealData && !loading ? (
          <>
            <Clock size={12} />
            {formatHours(completedMinutes ?? 0)} of {formatHours(goalMinutes ?? 0)} this week
          </>
        ) : (
          "of weekly goal"
        )}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-white">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, displayPercent)}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500">{loading ? "…" : `${displayPercent}%`}</span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
        <div>
          <p className="text-xs font-semibold text-slate-700">{message.title}</p>
          <p className="text-xs text-slate-400">{message.body}</p>
        </div>
      </div>
    </div>
  );
}
