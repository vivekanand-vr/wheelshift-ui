"use client";

import { useState, useEffect } from "react";
import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useEmployees } from "@/features/tasks/hooks";
import type { Employee } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

interface AssignEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (employee: Employee) => void;
  currentAssigneeId?: string;
}

export function AssignEmployeeModal({
  open,
  onClose,
  onSelect,
  currentAssigneeId,
}: AssignEmployeeModalProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const { data, isLoading, refetch } = useEmployees({ page, pageSize, search });

  // Fetch employees when modal opens or search/page changes
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, page, search, refetch]);

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    onClose();
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Assign Task to Employee</DialogTitle>
          <DialogDescription>
            Search and select an employee to assign this task to.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employee List */}
        <div className="min-h-100 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.content && data.content.length > 0 ? (
            <div className="space-y-2">
              {data.content.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors ${
                    currentAssigneeId === String(employee.id)
                      ? "bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-700"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex h-full w-full items-center justify-center font-medium">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                  </Avatar>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {employee.name}
                      </p>
                      {currentAssigneeId === String(employee.id) && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {employee.email}
                    </p>
                    {employee.department && (
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                        {employee.department}
                        {employee.position && ` • ${employee.position}`}
                      </p>
                    )}
                  </div>

                  {currentAssigneeId === String(employee.id) && (
                    <User className="text-primary-600 dark:text-primary-400 h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <User className="mb-3 h-12 w-12 text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400">
                {search ? "No employees found" : "No employees available"}
              </p>
              {search && (
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                  Try a different search term
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <Typography
              variant="small"
              className="text-neutral-600 dark:text-neutral-400"
            >
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, data.totalElements)} of{" "}
              {data.totalElements} employees
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
