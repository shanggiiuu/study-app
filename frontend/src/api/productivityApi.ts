import { apiClient } from "./client";
import type { DocumentItem, Flashcard, FlashcardDeck, Goal, GoalPayload, Note, NotePayload, QuizDetail, StudySession } from "../types/academic";

export const goalsApi = {
  list: async () => (await apiClient.get<Goal[]>("/goals")).data,
  create: async (payload: GoalPayload) => (await apiClient.post<Goal>("/goals", payload)).data,
  update: async (id: number, payload: GoalPayload) => (await apiClient.put<Goal>(`/goals/${id}`, payload)).data,
  complete: async (id: number) => (await apiClient.post<Goal>(`/goals/${id}/complete`)).data,
  delete: async (id: number) => { await apiClient.delete(`/goals/${id}`); },
};
export const notesApi = {
  list: async () => (await apiClient.get<Note[]>("/notes")).data,
  create: async (payload: NotePayload) => (await apiClient.post<Note>("/notes", payload)).data,
  update: async (id: number, payload: NotePayload) => (await apiClient.put<Note>(`/notes/${id}`, payload)).data,
  delete: async (id: number) => { await apiClient.delete(`/notes/${id}`); },
};
export const documentsApi = {
  list: async () => (await apiClient.get<DocumentItem[]>("/documents")).data,
  upload: async (file: File, title?: string, subjectId?: number) => { const form = new FormData(); form.append("file", file); if (title) form.append("title", title); if (subjectId) form.append("subjectId", String(subjectId)); return (await apiClient.post<DocumentItem>("/documents", form)).data; },
  delete: async (id: number) => { await apiClient.delete(`/documents/${id}`); },
  downloadUrl: (id: number) => `/api/documents/${id}/content`,
  generateFlashcards: async (id: number, count = 12) => (await apiClient.post<FlashcardDeck>(`/documents/${id}/generate-flashcards`, { count })).data,
  generateNotes: async (id: number) => (await apiClient.post<Note>(`/documents/${id}/generate-notes`)).data,
  generateQuiz: async (id: number, count = 8, type: "MCQ" | "FILL_BLANK" | "MIXED" = "MIXED") => (await apiClient.post<QuizDetail>(`/documents/${id}/generate-quiz`, { count, type })).data,
  chat: async (id: number, question: string) => (await apiClient.post<{ answer: string }>(`/documents/${id}/chat`, { question })).data.answer,
};
export const flashcardsApi = {
  decks: async () => (await apiClient.get<FlashcardDeck[]>("/flashcard-decks")).data,
  createDeck: async (payload: { title: string; subjectId?: number | null }) => (await apiClient.post<FlashcardDeck>("/flashcard-decks", payload)).data,
  deleteDeck: async (id: number) => { await apiClient.delete(`/flashcard-decks/${id}`); },
  cards: async (deckId: number) => (await apiClient.get<Flashcard[]>(`/flashcard-decks/${deckId}/cards`)).data,
  dueCards: async (deckId: number) => (await apiClient.get<Flashcard[]>(`/flashcard-decks/${deckId}/cards/due`)).data,
  addCard: async (deckId: number, payload: { front: string; back: string }) => (await apiClient.post<Flashcard>(`/flashcard-decks/${deckId}/cards`, payload)).data,
  review: async (deckId: number, cardId: number, quality: number) => (await apiClient.post<Flashcard>(`/flashcard-decks/${deckId}/cards/${cardId}/review`, null, { params: { quality } })).data,
  deleteCard: async (deckId: number, cardId: number) => { await apiClient.delete(`/flashcard-decks/${deckId}/cards/${cardId}`); },
};
export const sessionsApi = {
  list: async () => (await apiClient.get<StudySession[]>("/study-sessions")).data,
  start: async (subjectId?: number) => (await apiClient.post<StudySession>("/study-sessions/start", subjectId ? { subjectId } : {})).data,
  stop: async (id: number) => (await apiClient.post<StudySession>(`/study-sessions/${id}/stop`)).data,
};
