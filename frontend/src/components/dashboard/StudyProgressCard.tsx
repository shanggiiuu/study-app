import { CheckCircle2 } from "lucide-react";

export default function StudyProgressCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
      <p className="text-sm font-medium text-slate-500">Study Progress</p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">68%</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">of weekly goal</p>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-white">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: "68%" }} />
        </div>
        <span className="text-xs font-semibold text-slate-500">68%</span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
        <div>
          <p className="text-xs font-semibold text-slate-700">Great job!</p>
          <p className="text-xs text-slate-400">You're on track to reach your goal.</p>
        </div>
      </div>
    </div>
  );
}
