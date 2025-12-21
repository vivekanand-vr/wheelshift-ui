import { useAppDispatch, useAppSelector } from "../../store";
import type { RootState } from "../../store";
import {
  loginAsync,
  logoutAsync,
  checkAuthAsync,
  clearError,
} from "./authSlice";
import type { LoginCredentials } from "./types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    return dispatch(logoutAsync());
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
