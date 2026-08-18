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
