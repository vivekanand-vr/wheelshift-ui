import { api } from "@/lib/api/axios";
import type { LoginCredentials, LoginResponse } from "../types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
