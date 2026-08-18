import { apiClient } from "./client";
import type { CreateExamPayload, Exam } from "../types/academic";

export async function listExams(): Promise<Exam[]> {
  const { data } = await apiClient.get<Exam[]>("/exams");
  return data;
}

export async function createExam(payload: CreateExamPayload): Promise<Exam> {
  const { data } = await apiClient.post<Exam>("/exams", payload);
  return data;
}

export async function updateExam(id: number, payload: CreateExamPayload): Promise<Exam> {
  const { data } = await apiClient.put<Exam>(`/exams/${id}`, payload);
  return data;
}

export async function deleteExam(id: number): Promise<void> {
  await apiClient.delete(`/exams/${id}`);
}
