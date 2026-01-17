import axios from "axios";
import { toast } from "sonner";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log("API Response:", response.status, response.config.url);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.code;
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;

    // Handle 401 Unauthorized (Session Expired)
    if (error.response?.status === 401) {
      // Check if it's a session expired error
      if (
        errorCode === "SESSION_EXPIRED" &&
        !originalRequest._isSessionExpiredHandled
      ) {
        originalRequest._isSessionExpiredHandled = true;

        // Show toast notification
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please login again.", {
            duration: 4000,
          });

          // Clear persisted state
          localStorage.removeItem("persist:root");

          // Dispatch logout action if we have access to store
          // We'll handle this in a centralized way
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        }

        return Promise.reject(error);
      }

      // For other 401 errors (authentication failed)
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        toast.error(
          errorMessage || "Authentication failed. Please login again."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden (Insufficient Permissions or Access Denied)
    if (error.response?.status === 403) {
      if (errorCode === "INSUFFICIENT_PERMISSIONS") {
        toast.error("You do not have permission to perform this action.");
      } else if (errorCode === "ACCESS_DENIED") {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error(errorMessage || "Access denied.");
      }

      return Promise.reject(error);
    }

    // Handle other errors
    console.error("API Error:", {
      status: error.response?.status,
      code: errorCode,
      message: errorMessage,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default api;
