import { apiClient } from "./client";
import type { Assignment, CreateAssignmentPayload } from "../types/academic";

export async function listAssignments(): Promise<Assignment[]> {
  const { data } = await apiClient.get<Assignment[]>("/assignments");
  return data;
}

export async function createAssignment(payload: CreateAssignmentPayload): Promise<Assignment> {
  const { data } = await apiClient.post<Assignment>("/assignments", payload);
  return data;
}

export async function updateAssignment(id: number, payload: CreateAssignmentPayload): Promise<Assignment> {
  const { data } = await apiClient.put<Assignment>(`/assignments/${id}`, payload);
  return data;
}

export async function deleteAssignment(id: number): Promise<void> {
  await apiClient.delete(`/assignments/${id}`);
}
