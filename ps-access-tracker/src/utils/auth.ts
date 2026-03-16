import { getToken, getUser, setToken, setUser, clearToken, clearUser } from "../api/api";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
}

export function getSession(): SessionUser | null {
  return getUser();
}

export function setSession(user: SessionUser): void {
  setUser(user);
}

export function clearSession(): void {
  clearToken();
  clearUser();
}

export function getStoredToken(): string | null {
  return getToken();
}

export function storeAuth(token: string, user: SessionUser): void {
  setToken(token);
  setUser(user);
}
