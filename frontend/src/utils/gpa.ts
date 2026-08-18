import type { Subject } from "../types/academic";

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
