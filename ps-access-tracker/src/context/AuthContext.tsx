import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi } from "../api/api";
import { getSession, clearSession, storeAuth } from "../utils/auth";
import type { SessionUser } from "../utils/auth";

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (user: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getSession());

  useEffect(() => {
    setUser(getSession());
  }, []);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      storeAuth(data.token, data.user);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const { data: res } = await authApi.signup(data);
      storeAuth(res.token, res.user);
      setUser(res.user);
      return true;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 409) return false;
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
