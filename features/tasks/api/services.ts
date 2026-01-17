import api from "@/lib/api/axios";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  PaginatedResponse,
} from "../types";
import type { ApiResponse, Employee } from "@/types";

// Tasks API Services
export const tasksApi = {
  // Get all tasks with pagination and search
  getTasks: async (
    search?: string,
    page: number = 0,
    size: number = 20
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("size", size.toString());

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

  // Advanced search tasks with multiple filters
  searchTasks: async (
    filters?: TaskFilters,
    search?: string,
    page: number = 0,
    size: number = 20
  ): Promise<Task[]> => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (filters?.assignedToId)
      params.append("assignedToId", filters.assignedToId);
    if (filters?.status) params.append("status", filters.status as string);
    if (filters?.priority)
      params.append("priority", filters.priority as string);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
      `/tasks/search?${params.toString()}`
    );

    // Extract content array from paginated response and add order field if missing
    const tasks = response.data.data.content || [];
    return tasks.map((task, index) => ({
      ...task,
      order: task.order ?? index,
    }));
  },

  // Get tasks by employee (logged-in user)
  getTasksByEmployee: async (
    employeeId: string,
    search?: string,
    page: number = 0,
    size: number = 20
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
      `/tasks/employee/${employeeId}?${params.toString()}`
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
