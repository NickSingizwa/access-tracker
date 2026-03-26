import axios, { type AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://ps-access-tracker.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "ps_access_token";
const USER_KEY = "ps_access_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): { id: string; fullName: string; email: string } | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUser(user: { id: string; fullName: string; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      clearToken();
      clearUser();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(err);
  }
);

// Auth API
export const authApi = {
  signup: (data: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    email: string;
    password: string;
  }) => api.post<{ token: string; user: { id: string; fullName: string; email: string } }>("/auth/signup", data),

  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: string; fullName: string; email: string } }>("/auth/login", { email, password }),

  me: () => api.get<{ id: string; fullName: string; email: string }>("/auth/me"),
};

// Services API
export const servicesApi = {
  getAll: () => api.get<ServiceResponse[]>("/services"),
  getById: (id: string) => api.get<ServiceResponse>(`/services/${id}`),
};

// Certificates API
export const certificatesApi = {
  getAll: () => api.get<CertificateResponse[]>("/certificates"),
  create: (data: { certificateName: string; certificateNumber: string; issueDate: string; expiryDate: string }) =>
    api.post<CertificateResponse>("/certificates", data),
  update: (
    id: string,
    data: Partial<{ certificateName: string; certificateNumber: string; issueDate: string; expiryDate: string }>
  ) => api.put<CertificateResponse>(`/certificates/${id}`, data),
  delete: (id: string) => api.delete(`/certificates/${id}`),
};

// Types matching backend responses
export interface ServiceResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  stages: { name: string; office: string; time: string }[];
}

export interface CertificateResponse {
  id: string;
  name: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
}
