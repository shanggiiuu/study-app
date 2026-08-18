import { ChevronDown, MoveUpRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", gpa: 1.9 },
  { month: "Feb", gpa: 2.3 },
  { month: "Mar", gpa: 2.55 },
  { month: "Apr", gpa: 3.0 },
  { month: "May", gpa: 3.3 },
  { month: "Jun", gpa: 3.68 },
];

export default function GradeTrendChart() {
  return (
    <div className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Grade Trend</h2>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg border border-cream-200 px-2.5 py-1 text-xs font-medium text-slate-500"
        >
          6 Months
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="relative mt-4 h-48 flex-1">
        <span className="absolute right-2 top-0 rounded-lg bg-lavender-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
          3.68
        </span>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f3efe7" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              domain={[1, 4]}
              ticks={[1, 2, 3, 4]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="#6d5bd0"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#6d5bd0", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-3 rounded-xl bg-lavender-50 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-lavender-600">
          <MoveUpRight size={16} />
        </div>
        <p className="text-xs text-slate-600">
          Your GPA has improved by <span className="font-semibold">0.86 points</span> in the last 6
          months. Keep it up!
        </p>
      </div>
    </div>
  );
}
