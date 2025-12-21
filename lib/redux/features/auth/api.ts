import axios from "@/lib/api/axios";
import type { LoginCredentials, LoginResponse } from "./types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post("/auth/login", credentials, {
      withCredentials: true, // Important for session cookies
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
  },

  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await axios.get("/auth/me", {
      withCredentials: true,
    });
    return response.data;
  },
};
