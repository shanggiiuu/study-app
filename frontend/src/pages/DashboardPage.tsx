import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as subjectsApi from "../api/subjectsApi";
import * as assignmentsApi from "../api/assignmentsApi";
import * as examsApi from "../api/examsApi";
import * as calendarApi from "../api/calendarEventsApi";
import { sessionsApi } from "../api/productivityApi";
import type { Assignment, CalendarEvent, Exam, StudySession, Subject } from "../types/academic";
import {
  buildGpaTrend,
  calculateAveragePercent,
  calculateGpa,
  computeStreak,
  computeStudyProgress,
} from "../utils/gpa";
import GpaCard from "../components/dashboard/GpaCard";
import AverageGradeCard from "../components/dashboard/AverageGradeCard";
import StudyProgressCard from "../components/dashboard/StudyProgressCard";
import StudyStreakCard from "../components/dashboard/StudyStreakCard";
import SubjectPerformance from "../components/dashboard/SubjectPerformance";
import AiAdvice from "../components/dashboard/AiAdvice";
import GradeTrendChart from "../components/dashboard/GradeTrendChart";
import CalendarCard from "../components/dashboard/CalendarCard";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import ProgressBanner from "../components/dashboard/ProgressBanner";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      subjectsApi.listSubjects(),
      assignmentsApi.listAssignments(),
      examsApi.listExams(),
      calendarApi.listCalendarEvents(),
      sessionsApi.list(),
    ])
      .then(([s, a, e, events, studySessions]) => {
        setSubjects(s);
        setAssignments(a);
        setExams(e);
        setCalendarEvents(events);
        setSessions(studySessions);
      })
      .finally(() => setLoading(false));
  }, []);

  const gpa = calculateGpa(subjects);
  const average = calculateAveragePercent(subjects);
  const gpaTrend = buildGpaTrend(subjects);
  const studyProgress = computeStudyProgress(sessions, user?.weeklyStudyGoalMinutes ?? 300);
  const streak = computeStreak(sessions);

  const today = new Date().toISOString().slice(0, 10);
  const upcomingAssignments = assignments.filter((a) => a.status === "PENDING" && a.dueDate >= today);
  const upcomingExams = exams.filter((e) => e.examDate >= today);
  const deadlines = [
    ...upcomingAssignments.map((a) => ({ id: `a-${a.id}`, title: a.title, date: a.dueDate, subjectName: a.subjectName })),
    ...upcomingExams.map((e) => ({ id: `e-${e.id}`, title: e.title, date: e.examDate, subjectName: e.subjectName })),
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning, {firstName} 👋</h1>
            <p className="mt-1 text-slate-500">Here's your academic overview. Keep going, you're doing great!</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GpaCard gpa={gpa} trend={gpaTrend} loading={loading} />
            <AverageGradeCard average={average} loading={loading} />
            <StudyProgressCard
              completedMinutes={studyProgress.completedMinutes}
              goalMinutes={studyProgress.goalMinutes}
              percent={studyProgress.percent}
              loading={loading}
            />
            <StudyStreakCard current={streak.current} best={streak.best} loading={loading} />
          </div>

          <SubjectPerformance subjects={subjects} loading={loading} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AiAdvice />
            <GradeTrendChart data={gpaTrend} loading={loading} />
          </div>
        </div>

        <div className="space-y-6">
          <CalendarCard events={calendarEvents} />
          <TodaySchedule events={calendarEvents} loading={loading} />
          <UpcomingDeadlines deadlines={deadlines} loading={loading} />
        </div>
      </div>

      <ProgressBanner />
    </div>
  );
}
