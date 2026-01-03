"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  Plus,
  LayoutGrid,
  Table2,
  Filter,
  Search,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  setViewMode,
  clearFilters,
  openTaskForm,
  closeTaskForm,
  setSelectedTask,
} from "@/features/tasks/store/tasksSlice";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
} from "@/features/tasks/hooks";
import { KanbanBoard } from "./KanbanBoard";
import { TaskTableView } from "./TaskTableView";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskFiltersModal } from "./TaskFiltersModal";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/features/tasks/api/services";
import type {
  Task,
  TaskStatus,
  CreateTaskInput,
  TaskFilters,
} from "@/features/tasks/types";

export function TasksContainer() {
  const dispatch = useAppDispatch();
  const { viewMode, isCreatingTask, isEditingTask, selectedTask } =
    useAppSelector((state) => state.tasks);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<TaskFilters>({});

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
        // Use advanced search API
        return tasksApi.searchTasks(advancedFilters, debouncedSearchTerm);
      } else if (showMyTasksOnly && currentUser?.employeeId) {
        // Use employee tasks API
        return tasksApi.getTasksByEmployee(
          String(currentUser.employeeId),
          debouncedSearchTerm
        );
      } else {
        // Use regular tasks API
        return tasksApi.getTasks(debouncedSearchTerm);
      }
    },
    staleTime: 30000, // 30 seconds
  });

  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();

  // Handle view mode toggle
  const handleViewModeChange = (mode: "kanban" | "table") => {
    dispatch(setViewMode(mode));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle show my tasks toggle
  const handleToggleMyTasks = () => {
    setShowMyTasksOnly(!showMyTasksOnly);
    if (!showMyTasksOnly) {
      // When turning on, clear advanced filters
      setAdvancedFilters({});
    }
  };

  // Handle advanced filters
  const handleApplyFilters = (filters: TaskFilters) => {
    setAdvancedFilters(filters);
    setShowFiltersModal(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setAdvancedFilters({});
    setShowMyTasksOnly(false);
    dispatch(clearFilters());
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    dispatch(setSelectedTask(task));
    dispatch(openTaskForm(task));
  };

  // Handle create new task
  const handleCreateTask = () => {
    dispatch(openTaskForm(null));
  };

  // Handle save task
  const handleSaveTask = async (data: CreateTaskInput & { id?: string }) => {
    if (data.id) {
      // Update existing task
      await updateTaskMutation.mutateAsync({ id: data.id, ...data });
    } else {
      // Create new task
      await createTaskMutation.mutateAsync(data);
    }
    dispatch(closeTaskForm());
  };

  // Handle delete task
  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskMutation.mutateAsync(id);
      dispatch(closeTaskForm());
    }
  };

  // Handle task move in Kanban
  const handleTaskMove = async (
    taskId: string,
    newStatus: TaskStatus,
    newOrder: number
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    console.log("Moving task", taskId, "to", newStatus, "at order", newOrder);

    // Only update status if it changed (for Kanban drag and drop)
    if (task.status !== newStatus) {
      await updateTaskStatusMutation.mutateAsync({
        taskId,
        status: newStatus,
      });
    }
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.keys(advancedFilters).filter(
      (key) => advancedFilters[key as keyof TaskFilters] !== undefined
    ).length;
  }, [advancedFilters]);

  const hasFilters = activeFiltersCount > 0 || showMyTasksOnly;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-muted/50 space-y-4 rounded-lg border p-6">
        {/* Top Row: Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Show My Tasks Toggle */}
          <Button
            variant={showMyTasksOnly ? "default" : "outline"}
            size="sm"
            onClick={handleToggleMyTasks}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            My Tasks
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("kanban")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("table")}
              className="gap-2"
            >
              <Table2 className="h-4 w-4" />
              Table
            </Button>
          </div>

          {/* Advanced Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFiltersModal(true)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="ml-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}

          {/* Create Task Button */}
          <Button onClick={handleCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
              <Table2 className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              No tasks found
            </h3>
            <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
              {hasFilters
                ? "Try adjusting your filters to see more results."
                : "Get started by creating your first task."}
            </p>
            <Button onClick={handleCreateTask} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Task
            </Button>
          </div>
        ) : viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <TaskTableView tasks={tasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={isCreatingTask || isEditingTask}
        onClose={() => dispatch(closeTaskForm())}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        isLoading={
          createTaskMutation.isPending ||
          updateTaskMutation.isPending ||
          deleteTaskMutation.isPending
        }
      />

      {/* Advanced Filters Modal */}
      <TaskFiltersModal
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={handleApplyFilters}
        currentFilters={advancedFilters}
        currentUserId={
          currentUser?.employeeId ? String(currentUser.employeeId) : undefined
        }
        showMyTasksOnly={showMyTasksOnly}
      />
    </div>
  );
}
