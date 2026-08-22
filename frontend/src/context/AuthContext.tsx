import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import * as authApi from "../api/authApi";
import { apiClient } from "../api/client";

const TOKEN_KEY = "studyapp_token";
const THEME_KEY = "studyapp_theme";

export type Theme = "light" | "dark";

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  theme: Theme;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    applyThemeClass(readStoredTheme());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getCurrentUser()
      .then((u) => {
        setUser(u);
        localStorage.setItem(THEME_KEY, u.theme);
        applyThemeClass(u.theme);
        setThemeState(u.theme);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    localStorage.setItem(THEME_KEY, res.user.theme);
    applyThemeClass(res.user.theme);
    setThemeState(res.user.theme);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    localStorage.setItem(THEME_KEY, res.user.theme);
    applyThemeClass(res.user.theme);
    setThemeState(res.user.theme);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  const setTheme = useCallback(
    async (next: Theme) => {
      applyThemeClass(next);
      localStorage.setItem(THEME_KEY, next);
      setThemeState(next);
      if (!user) return;
      try {
        await apiClient.put("/users/me/settings", {
          weeklyStudyGoalMinutes: user.weeklyStudyGoalMinutes ?? 300,
          theme: next,
        });
        setUser((u) => (u ? { ...u, theme: next } : u));
      } catch {
        // Theme still applies locally even if the backend sync fails.
      }
    },
    [user]
  );

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      theme,
      login,
      register,
      logout,
      setTheme,
      updateUser,
    }),
    [user, isLoading, theme, login, register, logout, setTheme, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
