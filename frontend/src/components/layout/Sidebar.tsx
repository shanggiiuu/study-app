import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  TrendingUp,
  Sparkles,
  Target,
  Calendar,
  StickyNote,
  FolderOpen,
  Layers,
  HelpCircle,
  Timer,
  Trophy,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const mainLinks = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/grades", label: "My Grades", icon: GraduationCap },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/exams", label: "Exams", icon: FileText },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/advice", label: "Advice AI", icon: Sparkles },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/calendar", label: "Calendar", icon: Calendar },
];

const toolLinks = [
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/study-timer", label: "Study Timer", icon: Timer },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
];

function linkClasses(isActive: boolean) {
  return [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-lavender-600 text-white shadow-sm shadow-lavender-600/30"
      : "text-slate-500 hover:bg-lavender-100/70 hover:text-lavender-800",
  ].join(" ");
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-cream-200 bg-cream-100 px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-600 text-white">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">StudyDesk</span>
        </div>

        <nav className="space-y-1">
          {mainLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => linkClasses(isActive)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Tools
        </p>
        <nav className="space-y-1">
          {toolLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => linkClasses(isActive)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-white px-3 py-2.5 shadow-sm hover:border-lavender-300"
        >
          {user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender-200 text-sm font-semibold text-lavender-800">
              {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.name ?? "Student"}</p>
            <p className="truncate text-xs text-slate-400">View profile</p>
          </div>
          <ChevronRight size={16} className="shrink-0 text-slate-300" />
        </NavLink>
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
