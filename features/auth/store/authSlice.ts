import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { authApi } from "../api";
import type { AuthState, LoginCredentials, User } from "../types";
import type { UserRole } from "@/lib/constants/navigation";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

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

const transformUser = (response: any): User => ({
  ...response,
  role: mapRole(response.roles),
});

// Async thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return transformUser(response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
  return null;
});

export const checkAuthAsync = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return transformUser(response);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Authentication failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
