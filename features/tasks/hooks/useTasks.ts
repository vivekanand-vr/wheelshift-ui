import type { TaskFilters } from "../types";
import {
  useTasksQuery,
  useTaskQuery,
  useEmployeesQuery,
  useEmployeeQuery,
} from "../api/queries";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskOrdersMutation,
  useAssignTaskMutation,
  useUpdateTaskStatusMutation,
} from "../api/mutations";

// Task Query Hooks
export function useTasks(filters?: TaskFilters) {
  return useTasksQuery(filters);
}

export function useTask(id: string) {
  return useTaskQuery(id);
}

// Employee Query Hooks
export function useEmployees(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useEmployeesQuery(params);
}

export function useEmployee(id: string) {
  return useEmployeeQuery(id);
}

// Task Mutation Hooks
export function useCreateTask() {
  return useCreateTaskMutation();
}

export function useUpdateTask() {
  return useUpdateTaskMutation();
}

export function useDeleteTask() {
  return useDeleteTaskMutation();
}

export function useUpdateTaskOrders() {
  return useUpdateTaskOrdersMutation();
}

export function useAssignTask() {
  return useAssignTaskMutation();
}

export function useUpdateTaskStatus() {
  return useUpdateTaskStatusMutation();
}
