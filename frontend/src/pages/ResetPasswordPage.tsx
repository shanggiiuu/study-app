import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as authApi from "../api/authApi";
import { extractErrorMessage } from "../api/client";
import Logo from "../components/Logo";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to reset password"));
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

        {!token ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Invalid reset link</h1>
            <p className="mt-2 text-sm text-slate-500">
              This link is missing its reset token. Request a new one from the forgot password page.
            </p>
            <p className="mt-6 text-center text-sm text-slate-500">
              <Link to="/forgot-password" className="font-medium text-brand-700 hover:underline">
                Request a new link
              </Link>
            </p>
          </>
        ) : done ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Password updated</h1>
            <p className="mt-2 text-sm text-slate-500">Redirecting you to log in...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Set a new password</h1>
            <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
