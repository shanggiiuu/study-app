export interface GradeEntry {
  id: number;
  subjectId: number;
  label: string;
  score: number;
  maxScore: number;
  weight: number;
  category: string | null;
  date: string;
}

export interface CreateGradeEntryPayload {
  label: string;
  score: number;
  maxScore: number;
  weight?: number;
  category?: string | null;
  date: string;
}

export interface Subject {
  id: number;
  name: string;
  iconKey: string | null;
  colorKey: string | null;
  credits: number | null;
  currentPercent: number;
  letterGrade: string;
  grades: GradeEntry[];
}

export interface CreateSubjectPayload {
  name: string;
  iconKey?: string | null;
  colorKey?: string | null;
  credits?: number | null;
}

export type AssignmentStatus = "PENDING" | "SUBMITTED" | "GRADED";
export type AssignmentPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  notes: string | null;
  subjectId: number | null;
  subjectName: string | null;
  createdAt: string;
}

export interface CreateAssignmentPayload {
  title: string;
  dueDate: string;
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
  notes?: string | null;
  subjectId?: number | null;
}

export interface Exam {
  id: number;
  title: string;
  examDate: string;
  score: number | null;
  maxScore: number | null;
  location: string | null;
  subjectId: number | null;
  subjectName: string | null;
  createdAt: string;
}

export interface CreateExamPayload {
  title: string;
  examDate: string;
  score?: number | null;
  maxScore?: number | null;
  location?: string | null;
  subjectId?: number | null;
}

export type CalendarEventType = "CLASS" | "EXAM" | "STUDY" | "DEADLINE" | "OTHER";

export interface CalendarEvent {
  id: number;
  title: string;
  type: CalendarEventType;
  startTime: string;
  endTime: string | null;
  location: string | null;
  subjectId: number | null;
  subjectName: string | null;
}

export interface CreateCalendarEventPayload {
  title: string;
  type?: CalendarEventType;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  subjectId?: number | null;
}

export interface Goal { id: number; title: string; description: string | null; targetDate: string | null; progressPercent: number; status: string; createdAt: string; }
export interface GoalPayload { title: string; description?: string | null; targetDate?: string | null; progressPercent?: number; status?: string; }
export interface Note { id: number; subjectId: number | null; subjectName: string | null; title: string; body: string; createdAt: string; updatedAt: string; }
export interface NotePayload { title: string; body: string; subjectId?: number | null; }
export interface DocumentItem { id: number; subjectId: number | null; subjectName: string | null; title: string; originalFilename: string; contentType: string; byteSize: number; createdAt: string; textExtracted: boolean; }
export interface FlashcardDeck { id: number; subjectId: number | null; subjectName: string | null; title: string; cardCount: number; dueCount: number; }
export interface Flashcard { id: number; deckId: number; front: string; back: string; box: number; nextReviewDate: string; due: boolean; }
export interface StudySession { id: number; subjectId: number | null; subjectName: string | null; startTime: string; endTime: string | null; durationMinutes: number | null; inProgress: boolean; }

export type QuizQuestionType = "MCQ" | "FILL_BLANK";

export interface Quiz {
  id: number;
  subjectId: number | null;
  subjectName: string | null;
  documentId: number | null;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface QuizDetail {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface QuizQuestionResult {
  questionId: number;
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
}

export interface QuizAttemptResult {
  score: number;
  total: number;
  results: QuizQuestionResult[];
}
