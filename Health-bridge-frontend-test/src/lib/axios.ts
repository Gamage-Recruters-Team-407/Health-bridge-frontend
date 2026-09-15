import axios from "axios";

interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string> | Array<{ message?: string }>;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data;
    if (payload?.message) return payload.message;
    if (payload?.errors && !Array.isArray(payload.errors)) {
      const firstError = Object.values(payload.errors)[0];
      if (firstError) return firstError;
    }
    if (Array.isArray(payload?.errors) && payload.errors[0]?.message) {
      return payload.errors[0].message;
    }
  }

  return error instanceof Error ? error.message : fallback;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("healthbridge_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (
      payload &&
      typeof payload === "object" &&
      payload.success === true &&
      Object.prototype.hasOwnProperty.call(payload, "data")
    ) {
      response.data = payload.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear token on 401
        localStorage.removeItem("healthbridge_token");
        localStorage.removeItem("healthbridge_user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
