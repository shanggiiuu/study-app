import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient, extractErrorMessage } from "../api/client";
import type { User } from "../types/user";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    school: user?.school ?? "",
    gradeLevel: user?.gradeLevel ?? "",
    graduationYear: user?.graduationYear?.toString() ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiClient.put<User>("/users/me", {
        name: form.name,
        email: form.email,
        school: form.school || null,
        gradeLevel: form.gradeLevel || null,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
      });
      setSaved(true);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save profile"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
      <p className="mt-1 text-slate-500">Manage your personal and academic details.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">School</label>
          <input
            value={form.school}
            onChange={(e) => update("school", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Grade level</label>
            <input
              value={form.gradeLevel}
              onChange={(e) => update("gradeLevel", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Graduation year</label>
            <input
              type="number"
              value={form.graduationYear}
              onChange={(e) => update("graduationYear", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {saved && <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">Profile saved.</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
