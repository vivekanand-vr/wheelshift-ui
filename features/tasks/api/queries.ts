import { useQuery } from "@tanstack/react-query";
import { tasksApi, employeesApi } from "./services";
import type { TaskFilters } from "../types";

// TanStack Query keys
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters?: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

// Task Queries
export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => tasksApi.getTasks(filters),
    staleTime: 30000, // 30 seconds
  });
}

export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
}

// Employee Queries
export function useEmployeesQuery(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeesApi.getEmployees(params),
    staleTime: 60000, // 1 minute
  });
}

export function useEmployeeQuery(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeesApi.getEmployee(id),
    enabled: !!id,
  });
}
