"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import type { RootState } from "@/lib/redux/store";
import {
  logoutAsync,
  checkAuthAsync,
  clearError,
  setUser,
  validateSessionAsync,
} from "../store";
import type { LoginCredentials } from "../types";
import { useRouter } from "next/navigation";
import { useLoginMutation, useLogoutMutation } from "../api/mutations";
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react";

/**
 * Main auth hook - Comprehensive authentication management
 * Pattern: Component → useAuth hook → Queries/Mutations → Services (API)
 *
 * This hook handles:
 * - Authentication state (from Redux)
 * - Login/Logout operations (using React Query mutations)
 * - State synchronization between React Query and Redux
 * - Navigation and user feedback
 *
 * Usage in components:
 * const { login, logout, isLoading, error, user, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  /**
   * Login mutation with state management and navigation
   */
  const loginMutation = useLoginMutation({
    onSuccess: (user) => {
      // Update Redux state with user data
      dispatch(setUser(user));

      // Show success message
      toast.success("Login successful!");

      // Navigate to dashboard
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Login failed. Please try again.";

      // Show error notification
      toast.error(errorMessage);

      // Update Redux error state
      dispatch(clearError());
    },
  });

  /**
   * Logout mutation with cleanup and navigation
   */
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      // Clear Redux state
      dispatch(logoutAsync());

      // Clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:root");
      }

      // Show success message
      toast.success("Logged out successfully");

      // Navigate to login page
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    },
  });

  /**
   * Login function - handles user authentication
   * @param credentials - Email and password
   * @param onSuccess - Optional callback for custom success handling
   */
  const login = useCallback(
    async (credentials: LoginCredentials, onSuccess?: () => void) => {
      try {
        const user = await loginMutation.mutateAsync(credentials);

        // Call custom success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        return { success: true, user };
      } catch (error) {
        return { success: false, error };
      }
    },
    [loginMutation]
  );

  /**
   * Logout function - handles user logout
   */
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [logoutMutation]);

  /**
   * Check authentication status - verify current session
   */
  const checkAuth = useCallback(async () => {
    return dispatch(checkAuthAsync());
  }, [dispatch]);

  /**
   * Clear authentication errors
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Validate current session
   * Checks if session is still valid and handles expiry
   */
  const validateSession = useCallback(async () => {
    if (!auth.isAuthenticated) return { valid: false };

    try {
      const result = await dispatch(validateSessionAsync()).unwrap();

      if (!result.valid || result.expired) {
        // Session is expired or invalid
        toast.error(
          result.message || "Your session has expired. Please login again."
        );
        await logoutMutation.mutateAsync();
        return { valid: false, expired: true };
      }

      return { valid: true, expired: false };
    } catch (error: any) {
      // Session validation failed
      if (error === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please login again.");
        await logoutMutation.mutateAsync();
      }
      return { valid: false, expired: true };
    }
  }, [auth.isAuthenticated, dispatch, logoutMutation]);

  /**
   * Periodic session validation (every 5 minutes)
   * Only runs when user is authenticated
   */
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && typeof window !== "undefined") {
      // Clear any existing interval
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }

      // Set up periodic session check (every 5 minutes)
      sessionCheckInterval.current = setInterval(
        () => {
          validateSession();
        },
        5 * 60 * 1000
      ); // 5 minutes

      // Initial check after 1 minute
      const initialCheck = setTimeout(() => {
        validateSession();
      }, 60 * 1000);

      return () => {
        if (sessionCheckInterval.current) {
          clearInterval(sessionCheckInterval.current);
        }
        clearTimeout(initialCheck);
      };
    }
  }, [auth.isAuthenticated, validateSession]);

  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading:
      auth.isLoading || loginMutation.isPending || logoutMutation.isPending,
    error: auth.error,

    // Actions
    login,
    logout,
    checkAuth,
    validateSession,
    clearError: clearAuthError,

    // Mutation states (for granular control in components if needed)
    loginStatus: {
      isPending: loginMutation.isPending,
      isError: loginMutation.isError,
      isSuccess: loginMutation.isSuccess,
    },
    logoutStatus: {
      isPending: logoutMutation.isPending,
      isError: logoutMutation.isError,
      isSuccess: logoutMutation.isSuccess,
    },
  };
};
