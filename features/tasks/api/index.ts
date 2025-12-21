import axios from "@/lib/api/axios";
import type { Task, TaskFilters } from "../types";

export const taskService = {
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);

    const response = await axios.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  createTask: async (data: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    const response = await axios.post("/tasks", data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await axios.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`/tasks/${id}`);
  },
};
