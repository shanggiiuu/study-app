import { ArrowRight, ChevronRight, Flame, LineChart, Sparkles, Star, TrendingUp } from "lucide-react";

const advice = [
  {
    title: "Improve Chemistry grade",
    subtitle: 'Revise "Organic Reactions" and take practice quiz',
    icon: LineChart,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    title: "Strengthen Math skills",
    subtitle: "Practice Algebra & Calculus problems",
    icon: TrendingUp,
    iconBg: "bg-lavender-100",
    iconColor: "text-lavender-600",
  },
  {
    title: "Enhance study consistency",
    subtitle: "Maintain a 5-day study streak",
    icon: Flame,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function AiAdvice() {
  return (
    <div className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lavender-600 text-white">
          <Sparkles size={14} />
        </div>
        <h2 className="text-base font-semibold text-slate-800">AI Advice For You</h2>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-500">
          <Star size={16} fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Focus on consistency and active practice.</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Your Chemistry grade has potential! Try reviewing key topics and solving more practice
            problems.
          </p>
        </div>
      </div>

      <ul className="mt-2 flex-1 divide-y divide-cream-200">
        {advice.map(({ title, subtitle, icon: Icon, iconBg, iconColor }) => (
          <li key={title}>
            <a href="#" className="flex items-center gap-3 py-3 hover:opacity-80">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{title}</p>
                <p className="truncate text-xs text-slate-400">{subtitle}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-slate-300" />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="mt-1 flex items-center gap-1 text-sm font-semibold text-lavender-600 hover:text-lavender-700"
      >
        See all personalized advice
        <ArrowRight size={15} />
      </a>
    </div>
  );
}
