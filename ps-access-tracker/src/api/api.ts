import axios, { type AxiosError } from "axios";

// const API_BASE = "http://localhost:5000/api";
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

export function getUser(): { id: string; fullName: string; email: string; role: string } | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    const u = JSON.parse(data) as { id: string; fullName: string; email: string; role?: string };
    return {
      ...u,
      role: u.role && String(u.role).toLowerCase() === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export function setUser(user: { id: string; fullName: string; email: string; role: string }): void {
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
    if (err.response?.status === 403) {
      // Handle forbidden access, maybe show a message or redirect
      console.error("Access forbidden:", err.response.data);
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
  }) => api.post<{ token: string; user: { id: string; fullName: string; email: string; role: string } }>("/auth/signup", data),

  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: string; fullName: string; email: string; role: string } }>("/auth/login", { email, password }),

  me: () => api.get<{ id: string; fullName: string; email: string; role: string }>("/auth/me"),
};

// Services API
export const servicesApi = {
  getAll: (search?: string) =>
    api.get<ServiceResponse[]>("/services", {
      params: { search: search?.trim() || undefined },
    }),
  getById: (id: string) => api.get<ServiceResponse>(`/services/${id}`),
  create: (data: { name: string; category: string; description: string; requirements: string[]; stages: { stageName: string; office: string; expectedTime: string }[] }) =>
    api.post<ServiceResponse>("/services", data),
  update: (
    id: string,
    data: {
      name: string;
      category: string;
      description: string;
      requirements: string[];
      stages: { stageName: string; office: string; expectedTime: string }[];
    }
  ) => api.put<ServiceResponse>(`/services/${id}`, data),
};

// Certificates API
export const certificatesApi = {
  getAll: () => api.get<CertificateResponse[]>("/certificates"),
  getAllAdmin: () => api.get<AdminCertificateResponse[]>("/certificates/admin/all"),
  create: (data: { certificateName: string; certificateNumber: string; issueDate: string; expiryDate: string; file?: File }) => {
    const formData = new FormData();
    formData.append("certificateName", data.certificateName);
    formData.append("certificateNumber", data.certificateNumber);
    formData.append("issueDate", data.issueDate);
    formData.append("expiryDate", data.expiryDate);
    if (data.file) {
      formData.append("certificateFile", data.file);
    }
    return api.post<CertificateResponse>("/certificates", formData, {
      headers: { "Content-Type": undefined },
    });
  },
  update: (
    id: string,
    data: Partial<{ certificateName: string; certificateNumber: string; issueDate: string; expiryDate: string; file?: File }>
  ) => {
    const formData = new FormData();
    if (data.certificateName) formData.append("certificateName", data.certificateName);
    if (data.certificateNumber) formData.append("certificateNumber", data.certificateNumber);
    if (data.issueDate) formData.append("issueDate", data.issueDate);
    if (data.expiryDate) formData.append("expiryDate", data.expiryDate);
    if (data.file) {
      formData.append("certificateFile", data.file);
    }
    return api.put<CertificateResponse>(`/certificates/${id}`, formData, {
      headers: { "Content-Type": undefined },
    });
  },
  delete: (id: string) => api.delete(`/certificates/${id}`),
  download: (id: string) => api.get(`/certificates/${id}/download`, { responseType: "blob" }),
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
  fileName?: string;
  filePath?: string;
}

export interface AdminCertificateResponse extends CertificateResponse {
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
}
