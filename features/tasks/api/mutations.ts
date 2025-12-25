import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi } from "./services";
import { taskKeys } from "./queries";
import type { CreateTaskInput, UpdateTaskInput } from "../types";

// Create Task Mutation
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create task");
    },
  });
}

// Update Task Mutation
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => tasksApi.updateTask(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) });
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update task");
    },
  });
}

// Delete Task Mutation
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete task");
    },
  });
}

// Update Task Orders Mutation
export function useUpdateTaskOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { id: string; order: number; status?: string }[]) =>
      tasksApi.updateTaskOrders(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update task order");
    },
  });
}

// Assign Task Mutation
export function useAssignTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      employeeId,
    }: {
      taskId: string;
      employeeId: string;
    }) => tasksApi.assignTask(taskId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
      toast.success("Task assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to assign task");
    },
  });
}

// Update Task Status Mutation
export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      tasksApi.updateTaskStatus(taskId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
      toast.success("Task status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update task status");
    },
  });
}
