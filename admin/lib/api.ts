import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ditgital-diaries.onrender.com";

export const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = Cookies.get("dd_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if ((err.response?.status === 401 || err.response?.status === 403) && typeof window !== "undefined") {
      Cookies.remove("dd_admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const adminAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  getStats: () => api.get("/admin/stats"),

  // Users
  getUsers: (page = 1, search = "") => api.get(`/admin/users?page=${page}&search=${search}`),
  banUser: (id: string) => api.post(`/admin/users/${id}/ban`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Cards
  getCards: (page = 1) => api.get(`/admin/cards?page=${page}`),
  featureCard: (id: string) => api.post(`/admin/cards/${id}/feature`),

  // Posts
  getPosts: (params: Record<string, string>) => api.get("/admin/posts", { params }),
  getPost: (id: string) => api.get(`/admin/posts/${id}`),
  createPost: (data: unknown) => api.post("/admin/posts", data),
  updatePost: (id: string, data: unknown) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id: string, permanent = false) => api.delete(`/admin/posts/${id}?permanent=${permanent}`),

  // Categories
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data: unknown) => api.post("/admin/categories", data),
  updateCategory: (id: string, data: unknown) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

  // Media
  getMedia: () => api.get("/admin/media"),
  uploadMedia: (files: FormData) => api.post("/admin/media/upload", files, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteMedia: (id: string) => api.delete(`/admin/media/${id}`),
  // Settings
  getSettings: () => api.get("/admin/settings"),
  updateSettings: (settings: Record<string, string>) => api.put("/admin/settings", { settings }),

  // Templates
  getTemplates: () => api.get("/admin/templates"),
  updateTemplate: (id: string, data: unknown) => api.put(`/admin/templates/${id}`, data),

  // Card admin edit
  getCard: (id: string) => api.get(`/admin/cards/${id}`),
  updateCard: (id: string, data: unknown) => api.put(`/admin/cards/${id}`, data),
};
