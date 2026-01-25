"use client";

/**
 * Data Scope Management Hook
 * Handles data scope operations with React Query and error handling
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dataScopeService } from "../api/services";
import type {
  EmployeeDataScope,
  DataScopeRequest,
  ScopeType,
  ApiErrorResponse,
} from "../types";

export function useDataScopeManagement() {
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedScope, setSelectedScope] = useState<EmployeeDataScope | null>(
    null
  );
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Fetch all data scopes
  const {
    data: allScopes = [],
    isLoading: scopesLoading,
    error: scopesError,
  } = useQuery({
    queryKey: ["data-scopes"],
    queryFn: dataScopeService.getAllDataScopes,
  });

  // Fetch data scopes for selected employee
  const { data: employeeScopes = [], isLoading: employeeScopesLoading } =
    useQuery({
      queryKey: ["data-scopes", "employee", selectedEmployeeId],
      queryFn: () =>
        selectedEmployeeId
          ? dataScopeService.getDataScopesByEmployee(selectedEmployeeId)
          : Promise.resolve([]),
      enabled: !!selectedEmployeeId,
    });

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

  // Create data scope mutation
  const createMutation = useMutation({
    mutationFn: (data: DataScopeRequest) =>
      dataScopeService.createDataScope(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-scopes"] });
      toast.success("Data scope created successfully");
    },
    onError: handleApiError,
  });

  // Update data scope mutation
  const updateMutation = useMutation({
    mutationFn: ({
      scopeId,
      data,
    }: {
      scopeId: number;
      data: DataScopeRequest;
    }) => dataScopeService.updateDataScope(scopeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-scopes"] });
      toast.success("Data scope updated successfully");
    },
    onError: handleApiError,
  });

  // Delete data scope mutation
  const deleteMutation = useMutation({
    mutationFn: (scopeId: number) => dataScopeService.deleteDataScope(scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-scopes"] });
      toast.success("Data scope deleted successfully");
    },
    onError: handleApiError,
  });

  // Handler functions
  const handleCreateScope = (
    data: DataScopeRequest,
    onSuccess?: () => void
  ) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedScope(null);
      },
    });
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
      }
    );
  };

  const handleDeleteScope = (scopeId: number, onSuccess?: () => void) => {
    deleteMutation.mutate(scopeId, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedScope(null);
      },
    });
  };

  const handleSelectEmployee = (employeeId: number | null) => {
    setSelectedEmployeeId(employeeId);
  };

  // Group scopes by type for better organization
  const scopesByType: Record<ScopeType, EmployeeDataScope[]> = {
    LOCATION: allScopes.filter((s) => s.scopeType === "LOCATION"),
    DEPARTMENT: allScopes.filter((s) => s.scopeType === "DEPARTMENT"),
    ASSIGNMENT: allScopes.filter((s) => s.scopeType === "ASSIGNMENT"),
  };

  return {
    // Data
    allScopes,
    employeeScopes,
    scopesByType,
    selectedEmployeeId,
    selectedScope,
    apiError,
    errorDialogOpen,

    // Loading states
    scopesLoading,
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
