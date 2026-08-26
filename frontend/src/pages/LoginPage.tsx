import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import Logo from "../components/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), 5000);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to log in"));
    } finally {
      clearTimeout(slowTimer);
      setSubmitting(false);
      setSlow(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef3fb] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-bold tracking-tight text-slate-900">StudyDesk</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to your academic dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email or username</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-300"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          {slow && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Waking up the server — this can take up to a minute on the first request. Hang tight, don't refresh.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
