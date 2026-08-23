import { ArrowUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import type { GpaTrendPoint } from "../../utils/gpa";

const mockTrend = [
  { month: "Mar", value: 2.3 },
  { month: "", value: 2.55 },
  { month: "Apr", value: 2.5 },
  { month: "", value: 2.8 },
  { month: "May", value: 3.0 },
  { month: "", value: 2.95 },
  { month: "Jun", value: 3.3 },
  { month: "", value: 3.45 },
  { month: "Now", value: 3.68 },
];

interface GpaCardProps {
  gpa?: number | null;
  trend?: GpaTrendPoint[];
  loading?: boolean;
}

export default function GpaCard({ gpa, trend, loading = false }: GpaCardProps = {}) {
  const hasRealData = gpa !== undefined;
  const display = loading ? "…" : hasRealData ? (gpa === null ? "—" : gpa.toFixed(2)) : "3.68";
  const sparkline = trend ? trend.map((p) => ({ month: p.month, value: p.gpa ?? undefined })) : mockTrend;
  const monthLabels = trend ? trend.map((p) => p.month) : ["Mar", "Apr", "May", "Jun", "Now"];

  return (
    <div className="flex flex-col rounded-2xl border border-brand-100 bg-brand-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">GPA</p>
        {!hasRealData && (
          <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-600">
            <ArrowUp size={12} />
            0.23
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">{display}</span>
        <span className="text-sm text-slate-400">/ 4.00</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {hasRealData ? "Weighted by subject credits" : "vs last month"}
      </p>

      <div className="mt-3 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[1, 4]} hide width={0} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#gpaFill)"
              dot={{ r: 2.5, fill: "#2563eb", strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive={false}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        {monthLabels.map((label, i) => (
          <span key={`${label}-${i}`}>{label || " "}</span>
        ))}
      </div>
    </div>
  );
}
