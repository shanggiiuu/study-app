import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { CalendarEvent } from "../../types/academic";

const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export default function CalendarCard({ events = [] }: { events?: CalendarEvent[] }) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const days = useMemo(() => {
    const offset = (month.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - offset + 1));
  }, [month]);

  return <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <Link to={`/calendar?date=${dateKey(today)}`} className="text-base font-semibold text-slate-800 hover:text-brand-700">
        {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </Link>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous month" onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-cream-100"><ChevronLeft size={16} /></button>
        <button type="button" aria-label="Next month" onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-cream-100"><ChevronRight size={16} /></button>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
      {weekdays.map((day) => <span key={day} className="text-[11px] font-medium text-slate-400">{day}</span>)}
      {days.map((day) => { const isToday = dateKey(day) === dateKey(today); const current = day.getMonth() === month.getMonth(); const hasEvents = events.some((event) => dateKey(new Date(event.startTime)) === dateKey(day)); return <Link key={dateKey(day)} to={`/calendar?date=${dateKey(day)}`} aria-label={`Open ${day.toLocaleDateString()}`} className="flex flex-col items-center justify-center gap-0.5 py-0.5"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${isToday ? "bg-brand-600 font-semibold text-white" : current ? "text-slate-600 hover:bg-brand-50" : "text-slate-300"}`}>{day.getDate()}</span>{hasEvents && <span className={`h-1 w-1 rounded-full ${isToday ? "bg-white" : "bg-brand-500"}`} />}</Link>; })}
    </div>
    <Link to={`/calendar?date=${dateKey(today)}`} className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"><Plus size={16} /> Add or view events</Link>
  </div>;
}
