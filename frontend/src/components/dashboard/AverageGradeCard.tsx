import { ArrowUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const breakdown = [
  { label: "A", value: 40, color: "#f0a132" },
  { label: "B", value: 40, color: "#fbc55c" },
  { label: "C", value: 15, color: "#fbe3b8" },
  { label: "D", value: 5, color: "#e9e4f7" },
];

interface AverageGradeCardProps {
  average?: number | null;
  loading?: boolean;
}

export default function AverageGradeCard({ average, loading = false }: AverageGradeCardProps = {}) {
  const hasRealData = average !== undefined;
  const display = loading ? "…" : hasRealData ? (average === null ? "—" : `${average.toFixed(1)}%`) : "87%";

  return (
    <div className="flex flex-col rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Average Grade</p>
        {!hasRealData && (
          <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-600">
            <ArrowUp size={12} />
            4%
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">{display}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {hasRealData ? "Across graded subjects" : "vs last month"}
      </p>

      <div className="mt-3 flex flex-1 items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="value"
                innerRadius={30}
                outerRadius={46}
                startAngle={90}
                endAngle={450}
                paddingAngle={2}
                stroke="none"
              >
                {breakdown.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
            B+
          </div>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-500">
          {breakdown.map((entry) => (
            <li key={entry.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.label} {entry.value}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
