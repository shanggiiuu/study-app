import { apiClient } from "./client";
import type { CalendarEvent, CreateCalendarEventPayload } from "../types/academic";

/** Persisted events, safely scoped to the current authenticated user by the API. */
export async function listCalendarEvents(): Promise<CalendarEvent[]> {
  const { data } = await apiClient.get<CalendarEvent[]>("/calendar-events");
  return data;
}

export async function createCalendarEvent(payload: CreateCalendarEventPayload): Promise<CalendarEvent> {
  const { data } = await apiClient.post<CalendarEvent>("/calendar-events", payload);
  return data;
}

export async function updateCalendarEvent(id: number, payload: CreateCalendarEventPayload): Promise<CalendarEvent> {
  const { data } = await apiClient.put<CalendarEvent>(`/calendar-events/${id}`, payload);
  return data;
}

export async function deleteCalendarEvent(id: number): Promise<void> {
  await apiClient.delete(`/calendar-events/${id}`);
}
