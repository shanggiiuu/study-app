import { Bell, Moon, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

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

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white text-slate-500 shadow-sm hover:text-slate-700"
      >
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          3
        </span>
      </button>

      <button
        type="button"
        aria-label="Toggle dark mode"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-800"
      >
        <Moon size={18} />
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
