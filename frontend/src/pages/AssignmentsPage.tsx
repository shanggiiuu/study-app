import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import * as assignmentsApi from "../api/assignmentsApi";
import * as subjectsApi from "../api/subjectsApi";
import { extractErrorMessage } from "../api/client";
import type { Assignment, AssignmentPriority, AssignmentStatus, Subject } from "../types/academic";

interface FormState {
  title: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  notes: string;
  subjectId: string;
}

const emptyForm: FormState = { title: "", dueDate: "", status: "PENDING", priority: "MEDIUM", notes: "", subjectId: "" };

const statusLabels: Record<AssignmentStatus, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  GRADED: "Graded",
};

const statusStyles: Record<AssignmentStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-amber-100 text-amber-700",
  GRADED: "bg-green-100 text-green-700",
};

const priorityStyles: Record<AssignmentPriority, string> = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-lavender-100 text-lavender-700",
  HIGH: "bg-red-100 text-red-600",
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [a, s] = await Promise.all([assignmentsApi.listAssignments(), subjectsApi.listSubjects()]);
      setAssignments(
        [...a].sort((x, y) => (x.dueDate < y.dueDate ? -1 : 1))
      );
      setSubjects(s);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to load assignments"));
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(assignment: Assignment) {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title,
      dueDate: assignment.dueDate,
      status: assignment.status,
      priority: assignment.priority,
      notes: assignment.notes ?? "",
      subjectId: assignment.subjectId?.toString() ?? "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        dueDate: form.dueDate,
        status: form.status,
        priority: form.priority,
        notes: form.notes || null,
        subjectId: form.subjectId ? Number(form.subjectId) : null,
      };
      if (editingId) {
        await assignmentsApi.updateAssignment(editingId, payload);
      } else {
        await assignmentsApi.createAssignment(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save assignment"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this assignment?")) return;
    try {
      await assignmentsApi.deleteAssignment(id);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete assignment"));
    }
  }

  async function toggleDone(assignment: Assignment) {
    try {
      await assignmentsApi.updateAssignment(assignment.id, {
        title: assignment.title,
        dueDate: assignment.dueDate,
        status: assignment.status === "PENDING" ? "SUBMITTED" : "PENDING",
        priority: assignment.priority,
        notes: assignment.notes,
        subjectId: assignment.subjectId,
      });
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to update assignment"));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Assignments</h1>
          <p className="mt-1 text-slate-500">Track what's due and stay on top of your workload.</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-xl bg-lavender-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lavender-700"
        >
          <Plus size={16} /> Add assignment
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-lavender-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">{editingId ? "Edit assignment" : "New assignment"}</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Due date</label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
              >
                <option value="">None</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AssignmentStatus }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as AssignmentPriority }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-lavender-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lavender-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading assignments...</p>}
        {!loading && assignments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-lavender-300 bg-white p-10 text-center">
            <p className="text-slate-500">No assignments yet. Add one to start tracking your workload.</p>
          </div>
        )}
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-2xl border border-lavender-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={a.status !== "PENDING"} onChange={() => toggleDone(a)} className="h-5 w-5 rounded accent-lavender-600" />
              <div>
                <p className={`font-medium ${a.status !== "PENDING" ? "text-slate-400 line-through" : "text-slate-800"}`}>{a.title}</p>
                <p className="text-xs text-slate-500">
                  Due {a.dueDate}
                  {a.subjectName ? ` · ${a.subjectName}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[a.priority]}`}>{a.priority}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[a.status]}`}>{statusLabels[a.status]}</span>
              <button onClick={() => startEdit(a)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
