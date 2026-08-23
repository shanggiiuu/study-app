import { ChevronDown, MoveUpRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { GpaTrendPoint } from "../../utils/gpa";

const mockData = [
  { month: "Jan", gpa: 1.9 },
  { month: "Feb", gpa: 2.3 },
  { month: "Mar", gpa: 2.55 },
  { month: "Apr", gpa: 3.0 },
  { month: "May", gpa: 3.3 },
  { month: "Jun", gpa: 3.68 },
];

interface GradeTrendChartProps {
  data?: GpaTrendPoint[];
  loading?: boolean;
}

export default function GradeTrendChart({ data, loading = false }: GradeTrendChartProps = {}) {
  const hasRealData = data !== undefined;
  const points = hasRealData ? data! : mockData;

  const known = points.filter((p) => p.gpa !== null) as { month: string; gpa: number }[];
  const latest = known.at(-1)?.gpa ?? null;
  const first = known[0]?.gpa ?? null;
  const delta = latest !== null && first !== null ? latest - first : null;

  const chartData = points.map((p) => ({ month: p.month, gpa: p.gpa ?? undefined }));
  const empty = hasRealData && known.length === 0;

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

      {loading ? (
        <p className="mt-4 flex-1 text-sm text-slate-400">Loading grade trend…</p>
      ) : empty ? (
        <p className="mt-4 flex-1 text-sm text-slate-400">Add grade entries to see your GPA trend over time.</p>
      ) : (
        <>
          <div className="relative mt-4 h-48 flex-1">
            {latest !== null && (
              <span className="absolute right-2 top-0 rounded-lg bg-brand-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
                {latest.toFixed(2)}
              </span>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e5ebf5" />
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
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {delta !== null && (
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-brand-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <MoveUpRight size={16} />
              </div>
              <p className="text-xs text-slate-600">
                Your GPA has {delta >= 0 ? "improved" : "changed"} by{" "}
                <span className="font-semibold">{Math.abs(delta).toFixed(2)} points</span> in the last 6 months.{" "}
                {delta >= 0 ? "Keep it up!" : ""}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
