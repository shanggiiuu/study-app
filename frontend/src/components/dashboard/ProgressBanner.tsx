import { ArrowRight, Trophy } from "lucide-react";

export default function ProgressBanner() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 shadow-sm shadow-brand-600/20">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
          <Trophy size={22} />
        </div>
        <div>
          <p className="font-semibold text-white">You're making progress!</p>
          <p className="text-sm text-brand-100">
            Keep up the excellent work and achieve your goals!
          </p>
        </div>
      </div>

      <a
        href="/goals"
        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
      >
        View Goals
        <ArrowRight size={15} />
      </a>
    </div>
  );
}
