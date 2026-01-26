import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { authApi } from "./services";
import type { LoginCredentials, User } from "../types";

/**
 * Auth Mutations - React Query mutation configurations
 * Pattern: Hooks → Mutations → Services (API)
 */

/**
 * Login mutation configuration
 * Used for: User authentication
 */
export const useLoginMutation = (
  options?: UseMutationOptions<User, Error, LoginCredentials>
) => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    ...options,
  });
};

/**
 * Logout mutation configuration
 * Used for: User logout
 */
export const useLogoutMutation = (
  options?: UseMutationOptions<void, Error, void>
) => {
  return useMutation({
    mutationFn: () => authApi.logout(),
    ...options,
  });
};
