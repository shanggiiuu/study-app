import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "lucide-react";

interface DayCell {
  day: number;
  muted?: boolean;
  selected?: boolean;
  hasEvent?: boolean;
}

const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const weeks: DayCell[][] = [
  [{ day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }],
  [{ day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }],
  [{ day: 13 }, { day: 14 }, { day: 15, selected: true }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }],
  [{ day: 20 }, { day: 21 }, { day: 22, hasEvent: true }, { day: 23 }, { day: 24, hasEvent: true }, { day: 25 }, { day: 26 }],
  [{ day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 1, muted: true }, { day: 2, muted: true }],
];

export default function CalendarCard() {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">May 2024</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-cream-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-cream-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
        {weekDays.map((d) => (
          <span key={d} className="text-[11px] font-medium text-slate-400">
            {d}
          </span>
        ))}

        {weeks.flat().map((cell, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-0.5 py-0.5">
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-sm",
                cell.selected
                  ? "bg-lavender-600 font-semibold text-white"
                  : cell.muted
                    ? "text-slate-300"
                    : "text-slate-600",
              ].join(" ")}
            >
              {cell.day}
            </span>
            <span className={`h-1 w-1 rounded-full ${cell.hasEvent ? "bg-lavender-400" : "bg-transparent"}`} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lavender-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-lavender-600/30 hover:bg-lavender-700"
        >
          <Plus size={16} />
          Add event
        </button>
        <button
          type="button"
          aria-label="Filter"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cream-200 text-slate-400 hover:bg-cream-100"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
