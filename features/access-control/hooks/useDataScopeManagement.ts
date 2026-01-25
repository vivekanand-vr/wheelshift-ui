"use client";

/**
 * Data Scope Management Hook
 * Handles data scope operations with React Query
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dataScopeService } from "../api/services";
import type { EmployeeDataScope, DataScopeRequest, ScopeType } from "../types";

export function useDataScopeManagement() {
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

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

  // Create data scope mutation
  const createMutation = useMutation({
    mutationFn: (data: DataScopeRequest) =>
      dataScopeService.createDataScope(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-scopes"] });
      toast.success("Data scope created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create data scope"
      );
    },
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
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update data scope"
      );
    },
  });

  // Delete data scope mutation
  const deleteMutation = useMutation({
    mutationFn: (scopeId: number) => dataScopeService.deleteDataScope(scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-scopes"] });
      toast.success("Data scope deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete data scope"
      );
    },
  });

  // Handler functions
  const handleCreateScope = async (data: DataScopeRequest) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateScope = async (scopeId: number, data: DataScopeRequest) => {
    await updateMutation.mutateAsync({ scopeId, data });
  };

  const handleDeleteScope = async (scopeId: number) => {
    await deleteMutation.mutateAsync(scopeId);
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

    // Loading states
    scopesLoading,
    employeeScopesLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Errors
    scopesError,

    // Handlers
    handleCreateScope,
    handleUpdateScope,
    handleDeleteScope,
    handleSelectEmployee,
  };
}
