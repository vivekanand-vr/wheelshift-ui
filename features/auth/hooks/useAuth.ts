"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import type { RootState } from "@/lib/redux/store";
import { loginAsync, logoutAsync, checkAuthAsync, clearError } from "../store";
import type { LoginCredentials } from "../types";
import { useRouter } from "next/navigation";

/**
 * Main auth hook - provides auth state and actions
 * This connects to Redux store for state management
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    const result = await dispatch(logoutAsync());
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root");
    }
    router.push("/login");
    return result;
  };

  const checkAuth = async () => {
    return dispatch(checkAuthAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...auth,
    login,
    logout,
    checkAuth,
    clearError: clearAuthError,
  };
};
