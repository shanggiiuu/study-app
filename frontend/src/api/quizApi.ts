import { apiClient } from "./client";
import type { Quiz, QuizAttemptResult, QuizDetail } from "../types/academic";

export const quizApi = {
  list: async () => (await apiClient.get<Quiz[]>("/quizzes")).data,
  getOne: async (id: number) => (await apiClient.get<QuizDetail>(`/quizzes/${id}`)).data,
  delete: async (id: number) => { await apiClient.delete(`/quizzes/${id}`); },
  submitAttempt: async (id: number, answers: Record<number, string>) =>
    (await apiClient.post<QuizAttemptResult>(`/quizzes/${id}/attempts`, { answers })).data,
};
