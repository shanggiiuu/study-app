import { Atom, BookOpen, FlaskConical, Landmark, Leaf, Pi } from "lucide-react";

const subjects = [
  { name: "Mathematics", grade: "A-", percent: 92, icon: Pi, iconBg: "bg-lavender-100", iconColor: "text-lavender-600", barColor: "bg-lavender-500" },
  { name: "Physics", grade: "B+", percent: 85, icon: Atom, iconBg: "bg-sky-100", iconColor: "text-sky-600", barColor: "bg-sky-500" },
  { name: "Chemistry", grade: "B", percent: 78, icon: FlaskConical, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", barColor: "bg-emerald-500" },
  { name: "Biology", grade: "A", percent: 90, icon: Leaf, iconBg: "bg-green-100", iconColor: "text-green-600", barColor: "bg-green-500" },
  { name: "History", grade: "C+", percent: 72, icon: Landmark, iconBg: "bg-orange-100", iconColor: "text-orange-600", barColor: "bg-orange-500" },
  { name: "English", grade: "B+", percent: 84, icon: BookOpen, iconBg: "bg-pink-100", iconColor: "text-pink-600", barColor: "bg-pink-500" },
];

export default function SubjectPerformance() {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Subject Performance</h2>
        <a href="#" className="text-sm font-medium text-lavender-600 hover:text-lavender-700">
          View all
        </a>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {subjects.map(({ name, grade, percent, icon: Icon, iconBg, iconColor, barColor }) => (
          <div key={name} className="rounded-xl border border-cream-200 p-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
              <Icon size={16} />
            </div>
            <p className="mt-2 truncate text-xs font-medium text-slate-500">{name}</p>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-800">{grade}</span>
              <span className="text-xs text-slate-400">{percent}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-cream-200">
              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
