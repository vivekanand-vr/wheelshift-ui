"use client";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { ConfirmationDialog } from "@/components/common";
import { useTasksContainer } from "@/features/tasks/hooks";
import { KanbanBoard } from "./KanbanBoard";
import { TaskTableView } from "./TaskTableView";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskFiltersModal } from "./TaskFiltersModal";

export function TasksContainer() {
  const {
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
  } = useTasksContainer();

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-muted/50 space-y-4 rounded-md border p-4">
        {/* Top Row: Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Side: Search and My Tasks Toggle */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-[320px]">
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
            <div className="flex items-center gap-2">
              <Switch
                id="my-tasks"
                checked={showMyTasksOnly}
                onCheckedChange={handleToggleMyTasks}
              />
              <Label
                htmlFor="my-tasks"
                className="cursor-pointer text-sm font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  My Tasks
                </div>
              </Label>
            </div>
          </div>

          {/* Right Side: View Mode, Filters and New Task */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 dark:border-neutral-700 dark:bg-neutral-900">
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("kanban")}
                className="h-8 w-8 p-0"
                title="Kanban view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("table")}
                className="h-8 w-8 p-0"
                title="Table view"
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Filters Button */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenFiltersModal}
                  className="h-9 w-9 p-0"
                  title="Filters"
                >
                  <Filter className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-secondary dark:bg-destructive/20 dark:hover:bg-destructive dark:hover:text-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors"
                  title="Clear filters"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Create Task Button */}
            <Button onClick={handleCreateTask} size="sm" className="h-9 gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
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
            <Typography
              variant="large"
              className="mb-2 text-neutral-900 dark:text-neutral-100"
            >
              No tasks found
            </Typography>
            <Typography
              variant="muted"
              className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400"
            >
              {hasFilters
                ? "Try adjusting your filters to see more results."
                : "Get started by creating your first task."}
            </Typography>
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
            onCreateTask={handleCreateTask}
          />
        ) : (
          <TaskTableView tasks={tasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={isCreatingTask || isEditingTask}
        onClose={handleCloseTaskForm}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        isLoading={isSaving}
      />

      {/* Advanced Filters Modal */}
      <TaskFiltersModal
        open={showFiltersModal}
        onClose={handleCloseFiltersModal}
        onApply={handleApplyFilters}
        currentFilters={advancedFilters}
        currentUserId={
          currentUser?.employeeId ? String(currentUser.employeeId) : undefined
        }
        showMyTasksOnly={showMyTasksOnly}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isSaving}
      />
    </div>
  );
}
