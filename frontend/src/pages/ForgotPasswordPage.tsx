import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import * as authApi from "../api/authApi";
import { extractErrorMessage } from "../api/client";
import Logo from "../components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to send reset email"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef3fb] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-bold tracking-tight text-slate-900">StudyDesk</span>
        </div>

        {sent ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Check your email</h1>
            <p className="mt-2 text-sm text-slate-500">
              If an account exists for <span className="font-medium text-slate-700">{email}</span>, we've sent a
              link to reset your password. It expires in 1 hour.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Forgot your password?</h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your account email and we'll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
