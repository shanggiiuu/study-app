import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import * as subjectsApi from "../api/subjectsApi";
import { extractErrorMessage } from "../api/client";
import type { Subject } from "../types/academic";

interface SubjectFormState {
  name: string;
  credits: string;
}

const emptyForm: SubjectFormState = { name: "", credits: "" };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SubjectFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setSubjects(await subjectsApi.listSubjects());
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to load subjects"));
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(subject: Subject) {
    setEditingId(subject.id);
    setForm({ name: subject.name, credits: subject.credits?.toString() ?? "" });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        credits: form.credits ? Number(form.credits) : null,
      };
      if (editingId) {
        await subjectsApi.updateSubject(editingId, payload);
      } else {
        await subjectsApi.createSubject(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save subject"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this subject and all its grades?")) return;
    try {
      await subjectsApi.deleteSubject(id);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete subject"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Subjects</h1>
          <p className="mt-1 text-slate-500">Manage your subjects and track grades within each one.</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={16} /> Add subject
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-md space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-700">{editingId ? "Edit subject" : "New subject"}</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="e.g. AP Biology"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Credits</label>
            <input
              type="number"
              min="0"
              value={form.credits}
              onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="1"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
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
        {loading && <p className="text-sm text-slate-400">Loading subjects...</p>}
        {!loading && subjects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-300 bg-white p-10 text-center">
            <p className="text-slate-500">No subjects yet. Add your first one to start tracking grades.</p>
          </div>
        )}
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            expanded={expandedId === subject.id}
            onToggle={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
            onEdit={() => startEdit(subject)}
            onDelete={() => handleDelete(subject.id)}
            onGradesChanged={load}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onGradesChanged,
}: {
  subject: Subject;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGradesChanged: () => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <button onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4">
          {expanded ? <ChevronUp size={18} className="shrink-0 text-slate-400" /> : <ChevronDown size={18} className="shrink-0 text-slate-400" />}
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{subject.name}</p>
            <p className="text-xs text-slate-500">
              {subject.credits ?? 1} credit{(subject.credits ?? 1) === 1 ? "" : "s"} · {subject.grades.length} grade
              {subject.grades.length === 1 ? "" : "s"}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-brand-700">{subject.letterGrade}</p>
            <p className="text-xs text-slate-500">{subject.grades.length > 0 ? `${subject.currentPercent.toFixed(1)}%` : "—"}</p>
          </div>
          <button onClick={onEdit} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {expanded && <GradesPanel subject={subject} onGradesChanged={onGradesChanged} />}
    </div>
  );
}

interface GradeFormState {
  label: string;
  score: string;
  maxScore: string;
  weight: string;
  category: string;
  date: string;
}

const emptyGradeForm: GradeFormState = { label: "", score: "", maxScore: "", weight: "1", category: "", date: "" };

function GradesPanel({ subject, onGradesChanged }: { subject: Subject; onGradesChanged: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GradeFormState>(emptyGradeForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setEditingId(null);
    setForm(emptyGradeForm);
    setShowForm(true);
  }

  function startEdit(grade: Subject["grades"][number]) {
    setEditingId(grade.id);
    setForm({
      label: grade.label,
      score: grade.score.toString(),
      maxScore: grade.maxScore.toString(),
      weight: grade.weight.toString(),
      category: grade.category ?? "",
      date: grade.date,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        label: form.label,
        score: Number(form.score),
        maxScore: Number(form.maxScore),
        weight: form.weight ? Number(form.weight) : 1,
        category: form.category || null,
        date: form.date,
      };
      if (editingId) {
        await subjectsApi.updateGrade(subject.id, editingId, payload);
      } else {
        await subjectsApi.addGrade(subject.id, payload);
      }
      setShowForm(false);
      setForm(emptyGradeForm);
      setEditingId(null);
      await onGradesChanged();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save grade"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(gradeId: number) {
    if (!confirm("Delete this grade entry?")) return;
    try {
      await subjectsApi.deleteGrade(subject.id, gradeId);
      await onGradesChanged();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete grade"));
    }
  }

  return (
    <div className="border-t border-brand-100 bg-[#f4f7fc] p-5">
      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {subject.grades.length > 0 && (
        <div className="mb-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="pb-2">Label</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Weight</th>
              <th className="pb-2">Date</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {subject.grades.map((grade) => (
              <tr key={grade.id} className="border-t border-brand-100">
                <td className="py-2 font-medium text-slate-700">{grade.label}</td>
                <td className="py-2 text-slate-500">{grade.category ?? "—"}</td>
                <td className="py-2 text-slate-500">
                  {grade.score}/{grade.maxScore}
                </td>
                <td className="py-2 text-slate-500">{grade.weight}x</td>
                <td className="py-2 text-slate-500">{grade.date}</td>
                <td className="py-2 text-right">
                  <button onClick={() => startEdit(grade)} className="mr-2 text-slate-400 hover:text-slate-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(grade.id)} className="text-slate-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {!showForm && (
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-xl border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
        >
          <Plus size={14} /> Add grade
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-xl border border-brand-200 bg-white p-4 sm:grid-cols-3">
          <input
            required
            placeholder="Label (e.g. Quiz 1)"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 sm:col-span-1"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <input
            type="number"
            step="any"
            required
            placeholder="Score"
            value={form.score}
            onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <input
            type="number"
            step="any"
            required
            placeholder="Max score"
            value={form.maxScore}
            onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <input
            type="number"
            step="any"
            placeholder="Weight"
            value={form.weight}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <div className="col-span-2 flex gap-2 sm:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
