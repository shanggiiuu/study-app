import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as subjectsApi from "../api/subjectsApi";
import * as assignmentsApi from "../api/assignmentsApi";
import * as examsApi from "../api/examsApi";
import type { Assignment, Exam, Subject } from "../types/academic";
import { calculateAveragePercent, calculateGpa } from "../utils/gpa";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([subjectsApi.listSubjects(), assignmentsApi.listAssignments(), examsApi.listExams()])
      .then(([s, a, e]) => {
        setSubjects(s);
        setAssignments(a);
        setExams(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const gpa = calculateGpa(subjects);
  const average = calculateAveragePercent(subjects);

  const today = new Date().toISOString().slice(0, 10);
  const upcomingAssignments = assignments.filter((a) => a.status === "PENDING" && a.dueDate >= today);
  const upcomingExams = exams.filter((e) => e.examDate >= today);
  const nextDeadline = [...upcomingAssignments.map((a) => ({ label: a.title, date: a.dueDate })), ...upcomingExams.map((e) => ({ label: e.title, date: e.examDate }))].sort(
    (a, b) => (a.date < b.date ? -1 : 1)
  )[0];

  const statCards = [
    {
      label: "GPA",
      value: gpa !== null ? gpa.toFixed(2) : "—",
      detail: gpa !== null ? "Weighted by subject credits" : "Add subjects and grades to calculate your GPA",
    },
    {
      label: "Average Grade",
      value: average !== null ? `${average.toFixed(1)}%` : "—",
      detail: average !== null ? `Across ${subjects.filter((s) => s.grades.length > 0).length} subjects` : "No grades recorded yet",
    },
    {
      label: "Upcoming",
      value: `${upcomingAssignments.length + upcomingExams.length}`,
      detail: nextDeadline ? `Next: ${nextDeadline.label} on ${nextDeadline.date}` : "Nothing due — you're all caught up",
    },
    {
      label: "Study Streak",
      value: "—",
      detail: "Log a study session to start a streak",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Good morning, {firstName} 👋</h1>
      <p className="mt-1 text-slate-500">Here's your academic overview. Keep going, you're doing great!</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-lavender-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-lavender-700">{loading ? "…" : card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-lavender-300 bg-white p-10 text-center">
        <p className="text-slate-500">
          Progress charts, the calendar widget, and richer dashboard visuals arrive in Phase 3 — subjects, grades,
          assignments, and exams are live now.
        </p>
      </div>
    </div>
  );
}
