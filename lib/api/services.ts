import api from "./axios";

// Example API service functions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (data: { name?: string; bio?: string }) => {
    const response = await api.patch("/user/profile", data);
    return response.data;
  },
};

// Example of using with React Query
export const apiQueries = {
  user: {
    profile: () => ({
      queryKey: ["user", "profile"],
      queryFn: () => userService.getProfile(),
    }),
  },
};
