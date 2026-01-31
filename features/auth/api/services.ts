import { api } from "@/lib/api/axios";
import type { LoginCredentials, LoginResponse, User } from "../types";
import type { UserRole } from "@/types";
import type { ApiResponse } from "@/types";

/**
 * Auth Services - Pure API call functions using Axios
 * Pattern: Hooks → Queries/Mutations → Services (API)
 *
 * These functions should only handle HTTP requests and responses.
 * No business logic, state management, or side effects should be here.
 */

// Map backend roles to frontend roles
const mapRole = (roles: string[]): UserRole => {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("SALES")) return "SALES";
  if (roles.includes("INSPECTOR")) return "INSPECTOR";
  if (roles.includes("FINANCE")) return "FINANCE";
  if (roles.includes("STORE_MANAGER")) return "STORE_MANAGER";
  return "USER";
};

// Transform backend response to frontend User type
const transformUser = (response: LoginResponse): User => ({
  ...response,
  role: mapRole(response.roles),
});

/**
 * Auth API Services
 */
export const authApi = {
  /**
   * Login user with credentials
   * @param credentials - User email and password
   * @returns Authenticated user data with access token
   */
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);

    // Store JWT access token
    if (response.data.accessToken) {
      const { setAccessToken } = await import("@/lib/api/axios");
      setAccessToken(response.data.accessToken);
    }

    return transformUser(response.data);
  },

  /**
   * Logout current user
   * Clears JWT token
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");

    // Remove JWT access token
    const { removeAccessToken } = await import("@/lib/api/axios");
    removeAccessToken();
  },

  /**
   * Get current authenticated user
   * @returns Current user data
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<LoginResponse>>("/auth/me");
      console.log("getCurrentUser response:", response.data);
      return transformUser(response.data.data);
    } catch (error: any) {
      console.error(
        "getCurrentUser error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
