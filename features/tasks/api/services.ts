import api from "@/lib/api/axios";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  PaginatedResponse,
  Employee,
} from "../types";

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Tasks API Services
export const tasksApi = {
  // Get all tasks with filters
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach((s) => params.append("status", s));
      } else {
        params.append("status", filters.status);
      }
    }

    if (filters?.priority) {
      if (Array.isArray(filters.priority)) {
        filters.priority.forEach((p) => params.append("priority", p));
      } else {
        params.append("priority", filters.priority);
      }
    }

    if (filters?.assignedToId)
      params.append("assignedToId", filters.assignedToId);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
      `/tasks?${params.toString()}`
    );

    // Extract content array from paginated response and add order field if missing
    const tasks = response.data.data.content || [];
    return tasks.map((task, index) => ({
      ...task,
      order: task.order ?? index,
    }));
  },

  // Get single task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  // Create new task
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    return response.data.data;
  },

  // Update existing task
  updateTask: async (data: UpdateTaskInput): Promise<Task> => {
    const { id, ...updateData } = data;
    const response = await api.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      updateData
    );
    return response.data.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Bulk update task orders (for drag and drop)
  updateTaskOrders: async (
    updates: { id: string; order: number; status?: string }[]
  ): Promise<void> => {
    await api.patch("/tasks/bulk-update", { updates });
  },

  // Assign task to employee
  assignTask: async (taskId: string, employeeId: string): Promise<void> => {
    await api.put(`/tasks/${taskId}/assign?employeeId=${employeeId}`);
  },

  // Update task status
  updateTaskStatus: async (taskId: string, status: string): Promise<void> => {
    await api.put(`/tasks/${taskId}/status?status=${status}`);
  },
};

// Employees API Services
export const employeesApi = {
  // Get employees with pagination
  getEmployees: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginatedResponse<Employee>> => {
    const queryParams = new URLSearchParams();
    // API uses 0-indexed pages, so subtract 1 from the UI page number
    if (params?.page) queryParams.append("page", (params.page - 1).toString());
    // API uses 'size' parameter instead of 'pageSize'
    if (params?.pageSize)
      queryParams.append("size", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await api.get<ApiResponse<PaginatedResponse<Employee>>>(
      `/employees?${queryParams.toString()}`
    );
    return response.data.data;
  },

  // Get single employee
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data;
  },
};

// Legacy export for backwards compatibility
export const taskService = tasksApi;
