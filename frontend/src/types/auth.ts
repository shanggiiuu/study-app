import type { User } from "./user";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  school?: string;
  gradeLevel?: string;
  graduationYear?: number;
}
