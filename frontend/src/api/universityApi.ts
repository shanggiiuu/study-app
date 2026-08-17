import type { University, UniversitySearchParams } from "../types/university";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // response had no JSON body; keep default message
    }
    throw new Error(message);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function getAllUniversities(): Promise<University[]> {
  const response = await fetch(`${API_URL}/api/universities`);
  return handleResponse<University[]>(response);
}

export async function getUniversityById(id: number): Promise<University> {
  const response = await fetch(`${API_URL}/api/universities/${id}`);
  return handleResponse<University>(response);
}

export async function searchUniversities(params: UniversitySearchParams): Promise<University[]> {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.country) query.set("country", params.country);
  if (params.city) query.set("city", params.city);
  if (params.program) query.set("program", params.program);

  const response = await fetch(`${API_URL}/api/universities/search?${query.toString()}`);
  return handleResponse<University[]>(response);
}
