"use client";

import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { Plus, LayoutGrid, Table2, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  setViewMode,
  updateFilters,
  clearFilters,
  openTaskForm,
  closeTaskForm,
  setSelectedTask,
} from "@/features/tasks/store/tasksSlice";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
} from "@/features/tasks/hooks";
import { KanbanBoard } from "./KanbanBoard";
import { TaskTableView } from "./TaskTableView";
import { TaskDetailModal } from "./TaskDetailModal";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
} from "@/features/tasks/types";

export function TasksContainer() {
  const dispatch = useAppDispatch();
  const { viewMode, filters, isCreatingTask, isEditingTask, selectedTask } =
    useAppSelector((state) => state.tasks);

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useTasks(filters);

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
    dispatch(updateFilters({ search: value }));
  };

  // Handle filter changes
  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      const { status: _, ...rest } = filters;
      dispatch(updateFilters(rest));
    } else {
      dispatch(updateFilters({ status: status as TaskStatus }));
    }
  };

  const handlePriorityFilter = (priority: string) => {
    if (priority === "all") {
      const { priority: _, ...rest } = filters;
      dispatch(updateFilters(rest));
    } else {
      dispatch(updateFilters({ priority: priority as TaskPriority }));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
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

  // Handle task reorder in table
  const handleTaskReorder = async (taskId: string, newOrder: number) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      order: newOrder,
    });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const hasFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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

          {/* Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasFilters && (
              <Badge
                variant="default"
                className="ml-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Create Task Button */}
          <Button onClick={handleCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters Row */}
        {showFilters && (
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
            <div className="flex flex-1 items-center gap-3">
              <Select
                value={filters.status?.toString() || "all"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority?.toString() || "all"}
                onValueChange={handlePriorityFilter}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-screen">
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
          <TaskTableView
            tasks={tasks}
            onTaskReorder={handleTaskReorder}
            onTaskClick={handleTaskClick}
          />
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
    </div>
  );
}
