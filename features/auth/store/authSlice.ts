import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { authApi } from "../api";
import type { AuthState, LoginCredentials, User } from "../types";
import type { UserRole } from "@/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Maps backend role array to a single frontend UserRole
 * Priority: SUPER_ADMIN > ADMIN > SALES > INSPECTOR > FINANCE > STORE_MANAGER > USER
 * @param roles - Array of role strings from backend
 * @returns Single UserRole for the frontend
 */
const mapRole = (roles: string[]): UserRole => {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("SALES")) return "SALES";
  if (roles.includes("INSPECTOR")) return "INSPECTOR";
  if (roles.includes("FINANCE")) return "FINANCE";
  if (roles.includes("STORE_MANAGER")) return "STORE_MANAGER";
  return "USER";
};

/**
 * Transforms backend user response to frontend User type
 * Adds the mapped role to the user object
 * @param response - User data from backend API
 * @returns Transformed User object with role
 */
const transformUser = (response: any): User => ({
  ...response,
  role: mapRole(response.roles),
});

/**
 * Async thunk for user login
 * Authenticates user with credentials and returns user data
 * @param credentials - User email and password
 * @returns User data on success, error message on failure
 */
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return transformUser(response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

/**
 * Async thunk for user logout
 * Clears server-side session and resets auth state
 * @returns null to clear user data
 */
export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
  return null;
});

/**
 * Async thunk to check current authentication status
 * Verifies if user is authenticated and retrieves user data
 * Used on app initialization and route protection
 * @returns User data if authenticated, error on failure
 */
export const checkAuthAsync = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return transformUser(response);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);

/**
 * Async thunk to validate current session
 * Checks if the session is still valid and not expired
 * Used for periodic session validation
 * @returns Session validation result
 */
export const validateSessionAsync = createAsyncThunk(
  "auth/validateSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.validateSession();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.code || "SESSION_VALIDATION_FAILED"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clears authentication error from state
     * Used when user dismisses error or starts a new action
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Manually sets user data in state
     * Used when user data is obtained outside of async thunks
     * @param action - PayloadAction containing user data or null
     */
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.auth) {
        return {
          ...state,
          ...action.payload.auth,
          isLoading: false,
          error: null,
        };
      }
    });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        checkAuthAsync.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(checkAuthAsync.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
