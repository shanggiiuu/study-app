import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bell, CalendarClock, Moon, Search, Sun, Target } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as assignmentsApi from "../../api/assignmentsApi";
import * as examsApi from "../../api/examsApi";
import { goalsApi } from "../../api/productivityApi";
import { buildNotifications, type NotificationItem } from "../../utils/notifications";

const kindIcon = { assignment: AlertTriangle, exam: CalendarClock, goal: Target } as const;

const urgencyStyle = {
  overdue: { chip: "bg-red-100 text-red-600", label: "Overdue" },
  today: { chip: "bg-orange-100 text-orange-600", label: "Due today" },
  soon: { chip: "bg-sky-100 text-sky-600", label: "Coming up" },
} as const;

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Topbar() {
  const { user, theme, setTheme } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([assignmentsApi.listAssignments(), examsApi.listExams(), goalsApi.list()])
      .then(([assignments, exams, goals]) => setNotifications(buildNotifications(assignments, exams, goals)))
      .catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="flex items-center gap-4 px-8 pt-6">
      <div className="relative flex-1 max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-2xl border border-cream-200 bg-white py-3 pl-11 pr-16 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none focus:border-lavender-300"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>

      <div className="relative" ref={boxRef}>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white text-slate-500 shadow-sm hover:text-slate-700"
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notifications.length}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-14 z-20 w-80 rounded-2xl border border-cream-200 bg-white p-3 shadow-lg">
            <p className="px-2 pb-2 text-sm font-semibold text-slate-800">Notifications</p>
            {notifications.length === 0 ? (
              <p className="px-2 py-4 text-sm text-slate-400">Nothing needs your attention right now.</p>
            ) : (
              <ul className="max-h-80 space-y-1 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = kindIcon[n.kind];
                  const style = urgencyStyle[n.urgency];
                  return (
                    <li key={n.id} className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-cream-100">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.chip}`}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">{n.title}</p>
                        <p className="truncate text-xs text-slate-400">
                          {n.detail} · {formatDate(n.date)}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.chip}`}>
                        {style.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={() => void setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-800"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {user?.profilePictureUrl ? (
        <img src={user.profilePictureUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lavender-200 text-sm font-semibold text-lavender-800">
          {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
      )}
    </header>
  );
}
