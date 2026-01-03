"use client";

import { useState, useEffect } from "react";
import { X, User, Filter } from "lucide-react";
import type {
  TaskFilters,
  TaskStatus,
  TaskPriority,
  Employee,
} from "@/features/tasks/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AssignEmployeeModal } from "./AssignEmployeeModal";

interface TaskFiltersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: TaskFilters) => void;
  currentFilters?: TaskFilters;
  currentUserId?: string;
  showMyTasksOnly?: boolean;
}

export function TaskFiltersModal({
  open,
  onClose,
  onApply,
  currentFilters,
  currentUserId,
  showMyTasksOnly = false,
}: TaskFiltersModalProps) {
  const [filters, setFilters] = useState<TaskFilters>(
    currentFilters ||
      (showMyTasksOnly && currentUserId ? { assignedToId: currentUserId } : {})
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Sync local state with external currentFilters when modal opens
  useEffect(() => {
    if (open) {
      const newFilters =
        currentFilters ||
        (showMyTasksOnly && currentUserId
          ? { assignedToId: currentUserId }
          : {});

      // Only update if filters actually changed
      if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
        setFilters(newFilters);
      }

      // Reset selected employee when filters are cleared
      if (!currentFilters?.assignedToId && selectedEmployee) {
        setSelectedEmployee(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentFilters, showMyTasksOnly, currentUserId]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFilters({ ...filters, assignedToId: String(employee.id) });
  };

  const handleRemoveEmployee = () => {
    setSelectedEmployee(null);
    const { assignedToId: _assignedToId, ...rest } = filters;
    setFilters(rest);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof TaskFilters] !== undefined
  ).length;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </DialogTitle>
            <DialogDescription>
              Apply filters to narrow down your task list
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount} active
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Assigned To */}
            <div className="flex items-center gap-4">
              <Label className="min-w-25">Assigned To</Label>
              <div className="flex-1">
                {selectedEmployee || (showMyTasksOnly && currentUserId) ? (
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {selectedEmployee?.avatar ? (
                          <img
                            src={selectedEmployee.avatar}
                            alt={selectedEmployee.name}
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex h-full w-full items-center justify-center text-sm font-medium">
                            {showMyTasksOnly && !selectedEmployee
                              ? "ME"
                              : selectedEmployee?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {showMyTasksOnly && !selectedEmployee
                            ? "My Tasks"
                            : selectedEmployee?.name}
                        </p>
                        {selectedEmployee && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {selectedEmployee.email}
                          </p>
                        )}
                      </div>
                    </div>
                    {!showMyTasksOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveEmployee}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowEmployeeModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Select Employee
                  </Button>
                )}
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={(filters.status as string) || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      status:
                        value === "all" ? undefined : (value as TaskStatus),
                    })
                  }
                >
                  <SelectTrigger id="status" className="mt-1.5 w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={(filters.priority as string) || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      priority:
                        value === "all" ? undefined : (value as TaskPriority),
                    })
                  }
                >
                  <SelectTrigger id="priority" className="mt-1.5 w-full">
                    <SelectValue placeholder="All Priorities" />
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
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value || undefined,
                    })
                  }
                  className="mt-1.5 scheme-dark dark:scheme-dark"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      endDate: e.target.value || undefined,
                    })
                  }
                  className="mt-1.5 scheme-dark dark:scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear All
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!showMyTasksOnly && (
        <AssignEmployeeModal
          open={showEmployeeModal}
          onClose={() => setShowEmployeeModal(false)}
          onSelect={handleEmployeeSelect}
          currentAssigneeId={
            selectedEmployee?.id ? String(selectedEmployee.id) : undefined
          }
        />
      )}
    </>
  );
}
