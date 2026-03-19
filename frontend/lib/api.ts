import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("dd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("dd_token");
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
  me: () => api.get("/auth/me"),
};

// ─── Cards ────────────────────────────────────────────────────────────────────
export const cardsAPI = {
  getAll: () => api.get("/cards"),
  getById: (id: string) => api.get(`/cards/${id}`),
  getByUsername: (username: string) => api.get(`/cards/public/${username}`),
  create: (data: { username: string; templateId?: string }) =>
    api.post("/cards", data),
  update: (id: string, data: unknown) => api.put(`/cards/${id}`, data),
  publish: (id: string) => api.post(`/cards/${id}/publish`),
  delete: (id: string) => api.delete(`/cards/${id}`),
  getAnalytics: (id: string) => api.get(`/cards/${id}/analytics`),
  trackEvent: (id: string, event: string, meta?: unknown) =>
    api.post(`/cards/${id}/track`, { event, meta }),
};

// ─── Templates ────────────────────────────────────────────────────────────────
export const templatesAPI = {
  getAll: (category?: string) =>
    api.get("/templates", { params: { category }, headers: { "Cache-Control": "no-cache" } }),
  getById: (id: string) => api.get(`/templates/${id}`),
};

// ─── Leads ────────────────────────────────────────────────────────────────────
export const leadsAPI = {
  getByCard: (cardId: string) => api.get(`/leads/${cardId}`),
  submit: (cardId: string, data: unknown) =>
    api.post(`/leads/${cardId}`, data),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiAPI = {
  generateCard: (prompt: string) =>
    api.post("/ai/generate-card", { prompt }),
  generateContent: (type: string, context: unknown) =>
    api.post("/ai/generate-content", { type, context }),
  suggestDesign: (cardId: string) =>
    api.post("/ai/suggest-design", { cardId }),
};

// ─── Discover ─────────────────────────────────────────────────────────────────
export const discoverAPI = {
  search: (params: { profession?: string; location?: string; category?: string; q?: string }) =>
    api.get("/discover", { params }),
};

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptionsAPI = {
  getPlans: () => api.get("/subscriptions/plans"),
  subscribe: (planId: string) => api.post("/subscriptions/subscribe", { planId }),
  getStatus: () => api.get("/subscriptions/status"),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  getCards: (page = 1) => api.get(`/admin/cards?page=${page}`),
  banUser: (userId: string) => api.post(`/admin/users/${userId}/ban`),
  featureCard: (cardId: string) => api.post(`/admin/cards/${cardId}/feature`),
};
