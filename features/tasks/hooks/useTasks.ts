"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setViewMode,
  clearFilters,
  openTaskForm,
  closeTaskForm,
  setSelectedTask,
} from "../store/tasksSlice";
import type { TaskFilters, Task, TaskStatus, CreateTaskInput } from "../types";
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
  useUpdateTaskStatusMutation,
} from "../api/mutations";
import { tasksApi } from "../api/services";

// Simple Query Hooks for direct usage
export function useTasks(filters?: TaskFilters) {
  return useTasksQuery(filters);
}

export function useTask(id: string) {
  return useTaskQuery(id);
}

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

// Main Tasks Container Hook - Contains all business logic
export function useTasksContainer() {
  const dispatch = useAppDispatch();
  const { viewMode, isCreatingTask, isEditingTask, selectedTask } =
    useAppSelector((state) => state.tasks);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<TaskFilters>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Determine which API to call based on filters and toggle
  const hasAdvancedFilters = Object.keys(advancedFilters).length > 0;

  // Fetch tasks based on mode
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: [
      "tasks",
      showMyTasksOnly,
      debouncedSearchTerm,
      advancedFilters,
      currentUser?.employeeId,
    ],
    queryFn: async () => {
      if (hasAdvancedFilters) {
        return tasksApi.searchTasks(advancedFilters, debouncedSearchTerm);
      } else if (showMyTasksOnly && currentUser?.employeeId) {
        return tasksApi.getTasksByEmployee(
          String(currentUser.employeeId),
          debouncedSearchTerm
        );
      } else {
        return tasksApi.getTasks(debouncedSearchTerm);
      }
    },
    staleTime: 30000,
  });

  // Mutations
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.keys(advancedFilters).filter(
      (key) => advancedFilters[key as keyof TaskFilters] !== undefined
    ).length;
  }, [advancedFilters]);

  const hasFilters = activeFiltersCount > 0 || showMyTasksOnly;
  const isSaving =
    createTaskMutation.isPending ||
    updateTaskMutation.isPending ||
    deleteTaskMutation.isPending;

  // Handlers
  const handleViewModeChange = useCallback(
    (mode: "kanban" | "table") => {
      dispatch(setViewMode(mode));
    },
    [dispatch]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleToggleMyTasks = useCallback(() => {
    setShowMyTasksOnly((prev) => {
      if (!prev) {
        setAdvancedFilters({});
      }
      return !prev;
    });
  }, []);

  const handleApplyFilters = useCallback((filters: TaskFilters) => {
    setAdvancedFilters(filters);
    setShowFiltersModal(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setAdvancedFilters({});
    setShowMyTasksOnly(false);
    dispatch(clearFilters());
  }, [dispatch]);

  const handleTaskClick = useCallback(
    (task: Task) => {
      dispatch(setSelectedTask(task));
      dispatch(openTaskForm(task));
    },
    [dispatch]
  );

  const handleCreateTask = useCallback(() => {
    dispatch(openTaskForm(null));
  }, [dispatch]);

  const handleSaveTask = useCallback(
    async (data: CreateTaskInput & { id?: string }) => {
      if (data.id) {
        await updateTaskMutation.mutateAsync({ id: data.id, ...data });
      } else {
        await createTaskMutation.mutateAsync(data);
      }
      dispatch(closeTaskForm());
    },
    [updateTaskMutation, createTaskMutation, dispatch]
  );

  const handleDeleteTask = useCallback((id: string) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (taskToDelete) {
      try {
        await deleteTaskMutation.mutateAsync(taskToDelete);
        dispatch(closeTaskForm());
        setShowDeleteConfirm(false);
        setTaskToDelete(null);
      } catch (error) {
        console.error("Failed to delete task:", error);
        // Keep dialog open on error so user can retry
      }
    }
  }, [taskToDelete, deleteTaskMutation, dispatch]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  }, []);

  const handleTaskMove = useCallback(
    async (taskId: string, newStatus: TaskStatus, newOrder: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      console.log("Moving task", taskId, "to", newStatus, "at order", newOrder);

      if (task.status !== newStatus) {
        await updateTaskStatusMutation.mutateAsync({
          taskId,
          status: newStatus,
        });
      }
    },
    [tasks, updateTaskStatusMutation]
  );

  const handleOpenFiltersModal = useCallback(() => {
    setShowFiltersModal(true);
  }, []);

  const handleCloseFiltersModal = useCallback(() => {
    setShowFiltersModal(false);
  }, []);

  const handleCloseTaskForm = useCallback(() => {
    dispatch(closeTaskForm());
  }, [dispatch]);

  return {
    // State
    viewMode,
    isCreatingTask,
    isEditingTask,
    selectedTask,
    currentUser,
    searchTerm,
    showFiltersModal,
    showMyTasksOnly,
    advancedFilters,
    activeFiltersCount,
    hasFilters,
    tasks,
    isLoading,
    isSaving,
    showDeleteConfirm,

    // Handlers
    handleViewModeChange,
    handleSearch,
    handleToggleMyTasks,
    handleApplyFilters,
    handleClearFilters,
    handleTaskClick,
    handleCreateTask,
    handleSaveTask,
    handleDeleteTask,
    handleConfirmDelete,
    handleCancelDelete,
    handleTaskMove,
    handleOpenFiltersModal,
    handleCloseFiltersModal,
    handleCloseTaskForm,
  };
}
