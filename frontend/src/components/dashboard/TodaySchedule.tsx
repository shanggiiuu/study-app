import { CalendarClock, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CalendarEvent } from "../../types/academic";

const dateKey = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
const formatTime = (value: string) => new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function TodaySchedule({ events = [], loading = false }: { events?: CalendarEvent[]; loading?: boolean }) {
  const today = new Date();
  const todayKey = dateKey(today);
  const schedule = events
    .filter((event) => dateKey(new Date(event.startTime)) === todayKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-slate-800">Today · {today.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</h2>
      <Link to={`/calendar?date=${todayKey}`} className="text-sm font-medium text-lavender-600 hover:text-lavender-700">View full day</Link>
    </div>

    {loading ? <p className="mt-4 text-sm text-slate-400">Loading schedule…</p> : schedule.length === 0 ? (
      <p className="mt-4 text-sm text-slate-400">Nothing planned for today.</p>
    ) : (
      <ul className="relative mt-4 space-y-4 border-l border-cream-200 pl-4">
        {schedule.map((event) => <li key={event.id} className="relative flex items-start gap-3">
          <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-lavender-500" />
          <span className="w-11 shrink-0 text-xs text-slate-400">{formatTime(event.startTime)}</span>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lavender-100 text-lavender-600"><CalendarClock size={15} /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-700">{event.title}</p><p className="truncate text-xs text-slate-400">{event.location ?? event.subjectName ?? event.type}</p></div>
          {event.endTime && <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-500"><Clock3 size={12} />{formatTime(event.endTime)}</span>}
        </li>)}
      </ul>
    )}
  </div>;
}
