import { authApi } from "../api";
import type { LoginCredentials, User, LoginResponse } from "../types";
import type { UserRole } from "@/lib/constants/navigation";

// Map backend roles to frontend roles
const mapRole = (roles: string[]): UserRole => {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("SALES")) return "SALES";
  if (roles.includes("INSPECTOR")) return "INSPECTOR";
  if (roles.includes("FINANCE")) return "FINANCE";
  if (roles.includes("STORE_MANAGER")) return "STORE_MANAGER";
  return "guest";
};

const transformUser = (response: LoginResponse): User => ({
  ...response,
  role: mapRole(response.roles),
});

/**
 * Auth Queries - React Query configurations for auth operations
 * Following pattern: Hooks → Queries → API
 */
export const authQueries = {
  // Login mutation configuration
  login: {
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      const response = await authApi.login(credentials);
      return transformUser(response);
    },
  },

  // Logout mutation configuration
  logout: {
    mutationFn: async (): Promise<void> => {
      await authApi.logout();
    },
  },

  // Check auth query configuration
  checkAuth: {
    queryKey: ["auth", "current"],
    queryFn: async (): Promise<User> => {
      const response = await authApi.getCurrentUser();
      return transformUser(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  },
};
