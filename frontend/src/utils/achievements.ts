import type {
  Assignment,
  DocumentItem,
  Exam,
  Flashcard,
  FlashcardDeck,
  Goal,
  Note,
  Quiz,
  StudySession,
  Subject,
} from "../types/academic";
import { computeStreak } from "./gpa";

export interface AchievementInput {
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  goals: Goal[];
  notes: Note[];
  documents: DocumentItem[];
  decks: FlashcardDeck[];
  cards: Flashcard[];
  quizzes: Quiz[];
  sessions: StudySession[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "bookOpen" | "checkCircle" | "fileCheck" | "target" | "stickyNote" | "folder" | "layers" | "helpCircle" | "flame" | "clock" | "sunrise" | "moon";
  xp: number;
  current: number;
  target: number;
  unlocked: boolean;
}

export interface GamificationSummary {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  levelProgressPercent: number;
  achievements: Achievement[];
  unlockedCount: number;
}

const XP_PER_LEVEL = 250;

function def(
  id: string,
  title: string,
  description: string,
  icon: Achievement["icon"],
  xp: number,
  current: number,
  target: number
): Achievement {
  return { id, title, description, icon, xp, current: Math.min(current, target), target, unlocked: current >= target };
}

/** Everything here is derived purely from data already loaded elsewhere in the app — no new backend state. */
export function computeGamification(input: AchievementInput): GamificationSummary {
  const completedSessions = input.sessions.filter((s) => !s.inProgress && s.durationMinutes != null);
  const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  const completedAssignments = input.assignments.filter((a) => a.status !== "PENDING").length;
  const scoredExams = input.exams.filter((e) => e.score != null).length;
  const completedGoals = input.goals.filter((g) => g.status === "COMPLETED").length;
  const reviewedCards = input.cards.filter((c) => c.box > 1).length;
  const streak = computeStreak(input.sessions);
  const earlyBird = completedSessions.some((s) => new Date(s.startTime).getHours() < 7);
  const nightOwl = completedSessions.some((s) => new Date(s.startTime).getHours() >= 22);

  const achievements: Achievement[] = [
    def("first-subject", "First Steps", "Add your first subject", "bookOpen", 20, input.subjects.length, 1),
    def("five-subjects", "Getting Organized", "Track 5 subjects", "bookOpen", 40, input.subjects.length, 5),
    def("ten-assignments", "Task Master", "Complete 10 assignments", "checkCircle", 60, completedAssignments, 10),
    def("five-exams", "Exam Ready", "Record scores for 5 exams", "fileCheck", 60, scoredExams, 5),
    def("three-goals", "Goal Getter", "Complete 3 goals", "target", 75, completedGoals, 3),
    def("ten-notes", "Note Taker", "Write 10 notes", "stickyNote", 40, input.notes.length, 10),
    def("five-documents", "Librarian", "Upload 5 documents", "folder", 40, input.documents.length, 5),
    def("card-shark", "Card Shark", "Review 25 flashcards", "layers", 60, reviewedCards, 25),
    def("quiz-whiz", "Quiz Whiz", "Generate or create 5 quizzes", "helpCircle", 50, input.quizzes.length, 5),
    def("week-streak", "On Fire", "Study 7 days in a row", "flame", 100, streak.best, 7),
    def("month-streak", "Unstoppable", "Study 30 days in a row", "flame", 300, streak.best, 30),
    def("ten-hours", "Marathoner", "Log 10 hours of study time", "clock", 80, Math.round(totalMinutes / 60), 10),
    def("fifty-hours", "Deep Focus", "Log 50 hours of study time", "clock", 250, Math.round(totalMinutes / 60), 50),
    def("early-bird", "Early Bird", "Start a study session before 7am", "sunrise", 30, earlyBird ? 1 : 0, 1),
    def("night-owl", "Night Owl", "Start a study session after 10pm", "moon", 30, nightOwl ? 1 : 0, 1),
  ];

  const xp = achievements.reduce((sum, a) => sum + (a.unlocked ? a.xp : 0), 0) + Math.min(streak.current, 30) * 2;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;

  return {
    xp,
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    levelProgressPercent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
    achievements,
    unlockedCount: achievements.filter((a) => a.unlocked).length,
  };
}
