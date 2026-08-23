import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import * as examsApi from "../api/examsApi";
import * as subjectsApi from "../api/subjectsApi";
import { extractErrorMessage } from "../api/client";
import type { Exam, Subject } from "../types/academic";

interface FormState {
  title: string;
  examDate: string;
  score: string;
  maxScore: string;
  location: string;
  subjectId: string;
}

const emptyForm: FormState = { title: "", examDate: "", score: "", maxScore: "", location: "", subjectId: "" };

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
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
      const [e, s] = await Promise.all([examsApi.listExams(), subjectsApi.listSubjects()]);
      setExams([...e].sort((x, y) => (x.examDate < y.examDate ? -1 : 1)));
      setSubjects(s);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to load exams"));
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(exam: Exam) {
    setEditingId(exam.id);
    setForm({
      title: exam.title,
      examDate: exam.examDate,
      score: exam.score?.toString() ?? "",
      maxScore: exam.maxScore?.toString() ?? "",
      location: exam.location ?? "",
      subjectId: exam.subjectId?.toString() ?? "",
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
        examDate: form.examDate,
        score: form.score ? Number(form.score) : null,
        maxScore: form.maxScore ? Number(form.maxScore) : null,
        location: form.location || null,
        subjectId: form.subjectId ? Number(form.subjectId) : null,
      };
      if (editingId) {
        await examsApi.updateExam(editingId, payload);
      } else {
        await examsApi.createExam(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save exam"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this exam?")) return;
    try {
      await examsApi.deleteExam(id);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete exam"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Exams</h1>
          <p className="mt-1 text-slate-500">Keep track of upcoming and past exams.</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={16} /> Add exam
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">{editingId ? "Edit exam" : "New exam"}</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Exam date</label>
              <input
                type="date"
                required
                value={form.examDate}
                onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Score (optional)</label>
              <input
                type="number"
                step="any"
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Max score</label>
              <input
                type="number"
                step="any"
                value={form.maxScore}
                onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
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
        {loading && <p className="text-sm text-slate-400">Loading exams...</p>}
        {!loading && exams.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-300 bg-white p-10 text-center">
            <p className="text-slate-500">No exams yet. Add one to keep track of upcoming tests.</p>
          </div>
        )}
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-center justify-between rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <div>
              <p className="font-medium text-slate-800">{exam.title}</p>
              <p className="text-xs text-slate-500">
                {exam.examDate}
                {exam.subjectName ? ` · ${exam.subjectName}` : ""}
                {exam.location ? ` · ${exam.location}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {exam.score !== null && exam.maxScore !== null ? `${exam.score}/${exam.maxScore}` : "Not graded"}
              </span>
              <button onClick={() => startEdit(exam)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(exam.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
