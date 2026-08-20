import { apiClient } from "./client";

export async function getAdviceSummary(): Promise<string> { return (await apiClient.get<{ answer: string }>("/advice/summary")).data.answer; }
export async function askAdvice(question: string): Promise<string> { return (await apiClient.post<{ answer: string }>("/advice/chat", { question })).data.answer; }
