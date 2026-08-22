import type { Assignment, Exam, Goal } from "../types/academic";

export type NotificationUrgency = "overdue" | "today" | "soon";

export interface NotificationItem {
  id: string;
  kind: "assignment" | "exam" | "goal";
  title: string;
  detail: string;
  date: string;
  urgency: NotificationUrgency;
}

const HORIZON_DAYS = 3;

function urgencyFor(diffDays: number): NotificationUrgency {
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  return "soon";
}

function diffDays(date: string): number {
  return Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86_400_000);
}

/**
 * Notifications derived from existing assignment/exam/goal data — overdue or due within a
 * few days — rather than a separate backend notifications feature. Mirrors the dashboard's
 * UpcomingDeadlines widget, which computes deadlines the same way client-side.
 */
export function buildNotifications(assignments: Assignment[], exams: Exam[], goals: Goal[]): NotificationItem[] {
  const items: NotificationItem[] = [];

  for (const a of assignments) {
    if (a.status !== "PENDING") continue;
    const d = diffDays(a.dueDate);
    if (d > HORIZON_DAYS) continue;
    items.push({
      id: `a-${a.id}`,
      kind: "assignment",
      title: a.title,
      detail: a.subjectName ? `${a.subjectName} assignment` : "Assignment",
      date: a.dueDate,
      urgency: urgencyFor(d),
    });
  }

  for (const e of exams) {
    const d = diffDays(e.examDate);
    if (d > HORIZON_DAYS) continue;
    items.push({
      id: `e-${e.id}`,
      kind: "exam",
      title: e.title,
      detail: e.subjectName ? `${e.subjectName} exam` : "Exam",
      date: e.examDate,
      urgency: urgencyFor(d),
    });
  }

  for (const g of goals) {
    if (g.status === "COMPLETED" || !g.targetDate) continue;
    const d = diffDays(g.targetDate);
    if (d > HORIZON_DAYS) continue;
    items.push({
      id: `g-${g.id}`,
      kind: "goal",
      title: g.title,
      detail: "Goal target date",
      date: g.targetDate,
      urgency: urgencyFor(d),
    });
  }

  return items.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0));
}
