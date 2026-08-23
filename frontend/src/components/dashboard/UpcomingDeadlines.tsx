import { Atom, CalendarClock, FlaskConical, Landmark } from "lucide-react";

const mockDeadlines = [
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

const palette = [
  { iconBg: "bg-red-100", iconColor: "text-red-500", badgeBg: "bg-red-50", badgeColor: "text-red-500" },
  { iconBg: "bg-orange-100", iconColor: "text-orange-500", badgeBg: "bg-orange-50", badgeColor: "text-orange-500" },
  { iconBg: "bg-emerald-100", iconColor: "text-emerald-500", badgeBg: "bg-emerald-50", badgeColor: "text-emerald-500" },
  { iconBg: "bg-sky-100", iconColor: "text-sky-500", badgeBg: "bg-sky-50", badgeColor: "text-sky-500" },
];

export interface DeadlineItem {
  id: string;
  title: string;
  date: string;
  subjectName?: string | null;
}

function formatDaysLeft(date: string): string {
  const diffDays = Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86_400_000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
}

function formatDue(date: string): string {
  return `Due ${new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

interface UpcomingDeadlinesProps {
  deadlines?: DeadlineItem[];
  loading?: boolean;
}

export default function UpcomingDeadlines({ deadlines, loading = false }: UpcomingDeadlinesProps = {}) {
  const hasRealData = deadlines !== undefined;

  const items = hasRealData
    ? deadlines.slice(0, 5).map((d, i) => ({
        key: d.id,
        title: d.title,
        due: formatDue(d.date),
        left: formatDaysLeft(d.date),
        icon: CalendarClock,
        ...palette[i % palette.length],
      }))
    : mockDeadlines.map((d) => ({ key: d.title, ...d }));

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Upcoming Deadlines</h2>
        <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </a>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Nothing due — you're all caught up!</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map(({ key, title, due, left, icon: Icon, iconBg, iconColor, badgeBg, badgeColor }) => (
            <li key={key} className="flex items-center gap-3">
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
      )}
    </div>
  );
}
