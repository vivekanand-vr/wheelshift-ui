import axios from "axios";
import { toast } from "sonner";

/**
 * Get access token from localStorage
 */
const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

/**
 * Set access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

/**
 * Remove access token from localStorage
 */
export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add JWT token to Authorization header
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      if (token) {
        console.log("Token present:", token.substring(0, 20) + "...");
      } else {
        console.log("No token found");
      }
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

    // Handle 401 Unauthorized (Token Expired or Invalid)
    if (error.response?.status === 401) {
      // Check if it's a token expired error
      if (
        (errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN") &&
        !originalRequest._isTokenExpiredHandled
      ) {
        originalRequest._isTokenExpiredHandled = true;

        // Show toast notification
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please login again.", {
            duration: 4000,
          });

          // Clear token and persisted state
          removeAccessToken();
          localStorage.removeItem("persist:root");

          // Redirect to login
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

        // Clear token
        removeAccessToken();
        localStorage.removeItem("persist:root");

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

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server Error (500):", {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        response: error.response?.data,
        headers: error.config?.headers,
      });
      toast.error("Server error. Please try again later.");
      return Promise.reject(error);
    }

    // Handle other errors
    console.error("API Error:", {
      status: error.response?.status,
      code: errorCode,
      message: errorMessage,
      url: error.config?.url,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;
