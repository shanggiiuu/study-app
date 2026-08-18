import { Atom, FlaskConical, Landmark } from "lucide-react";

const deadlines = [
  {
    title: "Physics Assignment",
    due: "Due May 18, 23:59",
    left: "3 days left",
    icon: Atom,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    badgeBg: "bg-red-50",
    badgeColor: "text-red-500",
  },
  {
    title: "History Essay",
    due: "Due May 21, 23:59",
    left: "6 days left",
    icon: Landmark,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    badgeBg: "bg-orange-50",
    badgeColor: "text-orange-500",
  },
  {
    title: "Chemistry Lab Report",
    due: "Due May 24, 23:59",
    left: "9 days left",
    icon: FlaskConical,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeColor: "text-emerald-500",
  },
];

export default function UpcomingDeadlines() {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Upcoming Deadlines</h2>
        <a href="#" className="text-sm font-medium text-lavender-600 hover:text-lavender-700">
          View all
        </a>
      </div>

      <ul className="mt-4 space-y-3">
        {deadlines.map(({ title, due, left, icon: Icon, iconBg, iconColor, badgeBg, badgeColor }) => (
          <li key={title} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{title}</p>
              <p className="truncate text-xs text-slate-400">{due}</p>
            </div>
            <span className={`shrink-0 rounded-full ${badgeBg} ${badgeColor} px-2.5 py-1 text-[11px] font-semibold`}>
              {left}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
