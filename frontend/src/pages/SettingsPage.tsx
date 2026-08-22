import { useState, type FormEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient, extractErrorMessage } from "../api/client";

export default function SettingsPage() {
  const { user, theme, setTheme, updateUser } = useAuth();

  const [goalHours, setGoalHours] = useState(() => ((user?.weeklyStudyGoalMinutes ?? 300) / 60).toString());
  const [goalSaved, setGoalSaved] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);
  const [savingGoal, setSavingGoal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveGoal(e: FormEvent) {
    e.preventDefault();
    setGoalError(null);
    setGoalSaved(false);
    setSavingGoal(true);
    try {
      const weeklyStudyGoalMinutes = Math.round(Number(goalHours) * 60);
      await apiClient.put("/users/me/settings", { weeklyStudyGoalMinutes, theme });
      updateUser({ weeklyStudyGoalMinutes });
      setGoalSaved(true);
    } catch (err) {
      setGoalError(extractErrorMessage(err, "Unable to save your study goal"));
    } finally {
      setSavingGoal(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      await apiClient.put("/users/me/password", { currentPassword, newPassword });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(extractErrorMessage(err, "Unable to change your password"));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="mt-1 text-slate-500">Manage your appearance, study goal, and account security.</p>
      </header>

      <section className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Choose how StudyDesk looks on this device.</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => void setTheme("light")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              theme === "light"
                ? "border-lavender-400 bg-lavender-50 text-lavender-700"
                : "border-slate-200 text-slate-500 hover:border-lavender-200"
            }`}
          >
            <Sun size={16} /> Light
          </button>
          <button
            type="button"
            onClick={() => void setTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "border-lavender-400 bg-lavender-50 text-lavender-700"
                : "border-slate-200 text-slate-500 hover:border-lavender-200"
            }`}
          >
            <Moon size={16} /> Dark
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Weekly study goal</h2>
        <p className="mt-1 text-sm text-slate-500">Drives the Study Progress card on your dashboard.</p>
        <form onSubmit={saveGoal} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Hours per week</label>
            <input
              type="number"
              min="0"
              step="0.5"
              required
              value={goalHours}
              onChange={(e) => {
                setGoalHours(e.target.value);
                setGoalSaved(false);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
          </div>
          <button
            type="submit"
            disabled={savingGoal}
            className="rounded-xl bg-lavender-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:opacity-60"
          >
            {savingGoal ? "Saving..." : "Save"}
          </button>
        </form>
        {goalError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{goalError}</p>}
        {goalSaved && <p className="mt-3 rounded-lg bg-lavender-50 px-3 py-2 text-sm text-lavender-700">Study goal saved.</p>}
      </section>

      <section className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Change password</h2>
        <form onSubmit={savePassword} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
          </div>

          {passwordError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{passwordError}</p>}
          {passwordSaved && <p className="rounded-lg bg-lavender-50 px-3 py-2 text-sm text-lavender-700">Password changed.</p>}

          <button
            type="submit"
            disabled={savingPassword}
            className="rounded-xl bg-lavender-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:opacity-60"
          >
            {savingPassword ? "Saving..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}
