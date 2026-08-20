import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdviceSummary } from "../../api/adviceApi";
import { extractErrorMessage } from "../../api/client";

export default function AiAdvice() {
  const [advice, setAdvice] = useState(""); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getAdviceSummary().then(setAdvice).catch((err) => setError(extractErrorMessage(err, "AI advice is unavailable"))).finally(() => setLoading(false)); }, []);
  return <div className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lavender-600 text-white"><Sparkles size={14} /></div><h2 className="text-base font-semibold text-slate-800">AI Advice For You</h2></div><div className="mt-4 flex-1 rounded-xl bg-lavender-50 p-4">{loading ? <p className="text-sm text-slate-400">Preparing your personalized advice…</p> : error ? <p className="text-sm text-slate-500">{error}</p> : <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{advice}</p>}</div><Link to="/advice" className="mt-4 flex items-center gap-1 text-sm font-semibold text-lavender-600 hover:text-lavender-700">Ask Advice AI <ArrowRight size={15} /></Link></div>;
}
