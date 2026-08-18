import { FlaskConical, NotebookPen, Pi, Timer } from "lucide-react";

const schedule = [
  {
    time: "09:00",
    title: "Mathematics Class",
    subtitle: "Room 305",
    icon: Pi,
    dot: "bg-lavender-500",
    iconBg: "bg-lavender-100",
    iconColor: "text-lavender-600",
  },
  {
    time: "11:00",
    title: "Chemistry Lab",
    subtitle: "Room 210",
    icon: FlaskConical,
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    time: "14:00",
    title: "Study Session",
    subtitle: "Focus Time",
    icon: Timer,
    dot: "bg-sky-500",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    duration: "60 min",
  },
  {
    time: "16:00",
    title: "Review Notes",
    subtitle: "History",
    icon: NotebookPen,
    dot: "bg-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    duration: "45 min",
  },
];

export default function TodaySchedule() {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Today • May 15</h2>
        <a href="#" className="text-sm font-medium text-lavender-600 hover:text-lavender-700">
          View full day
        </a>
      </div>

      <ul className="relative mt-4 space-y-4 border-l border-cream-200 pl-4">
        {schedule.map(({ time, title, subtitle, icon: Icon, dot, iconBg, iconColor, duration }) => (
          <li key={time} className="relative flex items-start gap-3">
            <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="w-11 shrink-0 text-xs text-slate-400">{time}</span>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
              <Icon size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{title}</p>
              <p className="truncate text-xs text-slate-400">{subtitle}</p>
            </div>
            {duration && (
              <span className="shrink-0 rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {duration}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
