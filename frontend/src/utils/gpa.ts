import type { StudySession, Subject } from "../types/academic";

export function gpaPointsForPercent(percent: number): number {
  if (percent >= 93) return 4.0;
  if (percent >= 90) return 3.7;
  if (percent >= 87) return 3.3;
  if (percent >= 83) return 3.0;
  if (percent >= 80) return 2.7;
  if (percent >= 77) return 2.3;
  if (percent >= 73) return 2.0;
  if (percent >= 70) return 1.7;
  if (percent >= 67) return 1.3;
  if (percent >= 63) return 1.0;
  if (percent >= 60) return 0.7;
  return 0.0;
}

/** Weighted GPA (by subject credits) across subjects that have at least one grade entry. */
export function calculateGpa(subjects: Subject[]): number | null {
  const graded = subjects.filter((s) => s.grades.length > 0);
  if (graded.length === 0) return null;

  let totalPoints = 0;
  let totalCredits = 0;
  for (const subject of graded) {
    const credits = subject.credits ?? 1;
    totalPoints += gpaPointsForPercent(subject.currentPercent) * credits;
    totalCredits += credits;
  }
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}

export function calculateAveragePercent(subjects: Subject[]): number | null {
  const graded = subjects.filter((s) => s.grades.length > 0);
  if (graded.length === 0) return null;
  return graded.reduce((sum, s) => sum + s.currentPercent, 0) / graded.length;
}

export interface GpaTrendPoint {
  month: string;
  gpa: number | null;
}

/**
 * Weighted GPA as of the end of a given month, using only grade entries dated on or
 * before that point — mirrors the backend's SubjectDTO percent formula (score*weight /
 * maxScore*weight) so historical points are consistent with the live GPA card.
 */
export function buildGpaTrend(subjects: Subject[], months = 6): GpaTrendPoint[] {
  const now = new Date();
  const points: GpaTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const cutoff = monthEnd.toISOString().slice(0, 10);

    let totalPoints = 0;
    let totalCredits = 0;
    for (const subject of subjects) {
      const grades = subject.grades.filter((g) => g.date <= cutoff);
      if (grades.length === 0) continue;
      let totalWeighted = 0;
      let totalPossible = 0;
      for (const g of grades) {
        totalWeighted += g.score * g.weight;
        totalPossible += g.maxScore * g.weight;
      }
      if (totalPossible <= 0) continue;
      const percent = (totalWeighted / totalPossible) * 100;
      const credits = subject.credits ?? 1;
      totalPoints += gpaPointsForPercent(percent) * credits;
      totalCredits += credits;
    }

    points.push({
      month: monthEnd.toLocaleDateString(undefined, { month: "short" }),
      gpa: totalCredits > 0 ? totalPoints / totalCredits : null,
    });
  }

  return points;
}

export interface StudyProgress {
  completedMinutes: number;
  goalMinutes: number;
  percent: number;
}

/** Minutes studied so far this week (Mon–Sun) against the user's weekly goal. */
export function computeStudyProgress(sessions: StudySession[], goalMinutes: number): StudyProgress {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);

  const completedMinutes = sessions
    .filter((s) => !s.inProgress && s.durationMinutes != null && new Date(s.startTime) >= weekStart)
    .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

  const percent = goalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / goalMinutes) * 100)) : 0;
  return { completedMinutes, goalMinutes, percent };
}

export interface StudyStreak {
  current: number;
  best: number;
}

/** Consecutive-day study streaks, based on the calendar day of each completed session's start time. */
export function computeStreak(sessions: StudySession[]): StudyStreak {
  const days = new Set(
    sessions
      .filter((s) => !s.inProgress && s.durationMinutes != null)
      .map((s) => new Date(s.startTime).toDateString())
  );
  if (days.size === 0) return { current: 0, best: 0 };

  const sortedDates = Array.from(days)
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  const DAY_MS = 86_400_000;
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    run = sortedDates[i] - sortedDates[i - 1] === DAY_MS ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = 0;
  const cursor = new Date(today);
  while (days.has(cursor.toDateString())) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  // Studying isn't required *today* to keep the streak alive — allow yesterday as the anchor too.
  if (current === 0 && days.has(new Date(today.getTime() - DAY_MS).toDateString())) {
    const cursor2 = new Date(today.getTime() - DAY_MS);
    while (days.has(cursor2.toDateString())) {
      current++;
      cursor2.setDate(cursor2.getDate() - 1);
    }
  }

  return { current, best };
}
