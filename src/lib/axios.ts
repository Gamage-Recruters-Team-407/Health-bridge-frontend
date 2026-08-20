import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("healthbridge_token");
        localStorage.removeItem("healthbridge_user");
        // Redirect to login if not already there
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
    }
    // Log network errors for debugging
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network error - please check if the API server is running at:",
        API_BASE_URL
      );
    }
    return Promise.reject(error);
  }
);

export default api;