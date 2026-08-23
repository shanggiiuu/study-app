import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as subjectsApi from "../api/subjectsApi";
import { extractErrorMessage } from "../api/client";
import type { Subject } from "../types/academic";
import { calculateAveragePercent, calculateGpa } from "../utils/gpa";

interface GradeRow {
  id: number;
  subjectId: number;
  subjectName: string;
  label: string;
  category: string | null;
  score: number;
  maxScore: number;
  weight: number;
  date: string;
}

export default function GradesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    subjectsApi
      .listSubjects()
      .then(setSubjects)
      .catch((err) => setError(extractErrorMessage(err, "Unable to load grades")))
      .finally(() => setLoading(false));
  }, []);

  const gpa = calculateGpa(subjects);
  const average = calculateAveragePercent(subjects);

  const rows: GradeRow[] = subjects
    .flatMap((s) => s.grades.map((g) => ({ ...g, subjectId: s.id, subjectName: s.name })))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Grades</h1>
          <p className="mt-1 text-slate-500">A read-only overview of every grade you've logged.</p>
        </div>
        <Link
          to="/subjects"
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Manage grades
        </Link>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Overall GPA</p>
          <p className="mt-2 text-3xl font-semibold text-brand-700">{gpa !== null ? gpa.toFixed(2) : "—"}</p>
          <p className="mt-1 text-xs text-slate-400">Weighted by subject credits</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average grade</p>
          <p className="mt-2 text-3xl font-semibold text-brand-700">{average !== null ? `${average.toFixed(1)}%` : "—"}</p>
          <p className="mt-1 text-xs text-slate-400">Across {subjects.filter((s) => s.grades.length > 0).length} graded subjects</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-white shadow-sm">
        {loading && <p className="p-6 text-sm text-slate-400">Loading grades...</p>}
        {!loading && rows.length === 0 && (
          <p className="p-10 text-center text-slate-500">
            No grades logged yet. Head to <Link to="/subjects" className="font-medium text-brand-700">Subjects</Link> to add some.
          </p>
        )}
        {rows.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Label</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Weight</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-brand-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-700">{row.subjectName}</td>
                  <td className="px-5 py-3 text-slate-600">{row.label}</td>
                  <td className="px-5 py-3 text-slate-500">{row.category ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {row.score}/{row.maxScore}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{row.weight}x</td>
                  <td className="px-5 py-3 text-slate-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
