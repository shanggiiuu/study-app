import { apiClient } from "./client";
import type { CreateGradeEntryPayload, CreateSubjectPayload, GradeEntry, Subject } from "../types/academic";

export async function listSubjects(): Promise<Subject[]> {
  const { data } = await apiClient.get<Subject[]>("/subjects");
  return data;
}

export async function createSubject(payload: CreateSubjectPayload): Promise<Subject> {
  const { data } = await apiClient.post<Subject>("/subjects", payload);
  return data;
}

export async function updateSubject(id: number, payload: CreateSubjectPayload): Promise<Subject> {
  const { data } = await apiClient.put<Subject>(`/subjects/${id}`, payload);
  return data;
}

export async function deleteSubject(id: number): Promise<void> {
  await apiClient.delete(`/subjects/${id}`);
}

export async function addGrade(subjectId: number, payload: CreateGradeEntryPayload): Promise<GradeEntry> {
  const { data } = await apiClient.post<GradeEntry>(`/subjects/${subjectId}/grades`, payload);
  return data;
}

export async function updateGrade(
  subjectId: number,
  gradeId: number,
  payload: CreateGradeEntryPayload
): Promise<GradeEntry> {
  const { data } = await apiClient.put<GradeEntry>(`/subjects/${subjectId}/grades/${gradeId}`, payload);
  return data;
}

export async function deleteGrade(subjectId: number, gradeId: number): Promise<void> {
  await apiClient.delete(`/subjects/${subjectId}/grades/${gradeId}`);
}
