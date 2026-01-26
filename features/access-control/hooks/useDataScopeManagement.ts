"use client";

/**
 * Data Scope Management Hook
 * Handles data scope operations with React Query and error handling
 */

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateDataScope,
  useDeleteDataScope,
  useUpdateDataScope,
} from "../api/mutations";
import { useDataScopesByEmployee } from "../api/queries";
import type {
  EmployeeDataScope,
  DataScopeRequest,
  ScopeType,
  ApiErrorResponse,
} from "../types";

export function useDataScopeManagement() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedScope, setSelectedScope] = useState<EmployeeDataScope | null>(
    null
  );
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const employeeIdForQuery = selectedEmployeeId ?? 0;

  const {
    data: employeeScopes = [],
    isLoading: employeeScopesLoading,
    error: scopesError,
  } = useDataScopesByEmployee(employeeIdForQuery);

  const createMutation = useCreateDataScope();
  const updateMutation = useUpdateDataScope();
  const deleteMutation = useDeleteDataScope();

  // Error handler
  const handleApiError = (error: any) => {
    if (error?.response?.data) {
      const errorData = error.response.data;
      setApiError({
        type: errorData.type || "about:blank",
        title: errorData.title || "An Error Occurred",
        status: errorData.status || 500,
        detail: errorData.detail || "An unexpected error occurred",
        instance: errorData.instance || "",
        code: errorData.code || "UNKNOWN_ERROR",
        timestamp: errorData.timestamp || new Date().toISOString(),
      });
      setErrorDialogOpen(true);
    }
  };

  // Handler functions
  const handleCreateScope = (
    data: DataScopeRequest,
    onSuccess?: () => void
  ) => {
    if (!selectedEmployeeId) {
      toast.error("Select an employee before creating a data scope");
      return;
    }

    createMutation.mutate(
      { employeeId: selectedEmployeeId, data },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedScope(null);
        },
        onError: handleApiError,
      }
    );
  };

  const handleUpdateScope = (
    scopeId: number,
    data: DataScopeRequest,
    onSuccess?: () => void
  ) => {
    updateMutation.mutate(
      { scopeId, data },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedScope(null);
        },
        onError: handleApiError,
      }
    );
  };

  const handleDeleteScope = (scopeId: number, onSuccess?: () => void) => {
    deleteMutation.mutate(
      { scopeId },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedScope(null);
        },
        onError: handleApiError,
      }
    );
  };

  const handleSelectEmployee = (employeeId: number | null) => {
    setSelectedEmployeeId(employeeId);
  };

  // Group scopes by type for better organization
  const scopesByType: Record<ScopeType, EmployeeDataScope[]> = {
    LOCATION: employeeScopes.filter((s) => s.scopeType === "LOCATION"),
    DEPARTMENT: employeeScopes.filter((s) => s.scopeType === "DEPARTMENT"),
    ASSIGNMENT: employeeScopes.filter((s) => s.scopeType === "ASSIGNMENT"),
  };

  return {
    // Data
    employeeScopes,
    scopesByType,
    selectedEmployeeId,
    selectedScope,
    apiError,
    errorDialogOpen,

    // Loading states
    employeeScopesLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Errors
    scopesError,

    // Actions
    setSelectedScope,
    setErrorDialogOpen,
    handleCreateScope,
    handleUpdateScope,
    handleDeleteScope,
    handleSelectEmployee,
  };
}
