import { useAppDispatch, useAppSelector } from "../../store";
import type { RootState } from "../../store";
import {
  loginAsync,
  logoutAsync,
  checkAuthAsync,
  clearError,
} from "./authSlice";
import type { LoginCredentials } from "./types";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    const result = await dispatch(logoutAsync());
    // Clear local storage and redirect
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
