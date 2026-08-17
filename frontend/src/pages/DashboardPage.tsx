import { useAuth } from "../context/AuthContext";

const statCards = [
  { label: "GPA", detail: "Add subjects and grades to calculate your GPA" },
  { label: "Average Grade", detail: "No grades recorded yet" },
  { label: "Study Progress", detail: "Set a weekly study goal to track progress" },
  { label: "Study Streak", detail: "Log a study session to start a streak" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Good morning, {firstName} 👋</h1>
      <p className="mt-1 text-slate-500">Here's your academic overview. Keep going, you're doing great!</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-lavender-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-sm text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-lavender-300 bg-white p-10 text-center">
        <p className="text-slate-500">
          Subjects, grades, assignments, exams, and the rest of your dashboard arrive as later build
          phases land — this is Phase 1: authentication and the app shell.
        </p>
      </div>
    </div>
  );
}
