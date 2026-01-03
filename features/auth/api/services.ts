import { api } from "@/lib/api/axios";
import type { LoginCredentials, LoginResponse, User } from "../types";
import type { UserRole } from "@/lib/constants/navigation";

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

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

// Auth API Services
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Login endpoint returns user object directly (not wrapped in ApiResponse)
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return transformUser(response.data);
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<LoginResponse>>("/auth/me");
    return transformUser(response.data.data);
  },
};

/**
 * Auth Queries - React Query configurations for auth operations
 * Following pattern: Hooks → Queries → API
 */
export const authQueries = {
  // Login mutation configuration
  login: {
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      return authApi.login(credentials);
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
      return authApi.getCurrentUser();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  },
};
