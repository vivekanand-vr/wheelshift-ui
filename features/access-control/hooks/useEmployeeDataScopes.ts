"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/types";
import type {
  EmployeeDataScope,
  CreateDataScopeInput,
  UpdateDataScopeInput,
} from "../types";
import { dataScopeService } from "../api/services";

export function useEmployeeDataScopes(employeeId: number) {
  const queryClient = useQueryClient();
  const [selectedScope, setSelectedScope] = useState<EmployeeDataScope | null>(
    null
  );
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Fetch employee data scopes
  const {
    data: scopes = [],
    isLoading: scopesLoading,
    error: scopesError,
  } = useQuery({
    queryKey: ["data-scopes", "employee", employeeId],
    queryFn: () => dataScopeService.getDataScopesByEmployee(String(employeeId)),
    enabled: !!employeeId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDataScopeInput) =>
      dataScopeService.createDataScope(String(employeeId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data-scopes", "employee", employeeId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      setApiError(error);
      setErrorDialogOpen(true);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      scopeId,
      data,
    }: {
      scopeId: string;
      data: UpdateDataScopeInput;
    }) => dataScopeService.updateDataScope(scopeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data-scopes", "employee", employeeId],
      });
      setSelectedScope(null);
    },
    onError: (error: ApiErrorResponse) => {
      setApiError(error);
      setErrorDialogOpen(true);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (scopeId: string) => dataScopeService.deleteDataScope(scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data-scopes", "employee", employeeId],
      });
      setSelectedScope(null);
    },
    onError: (error: ApiErrorResponse) => {
      setApiError(error);
      setErrorDialogOpen(true);
    },
  });

  // Handler callbacks
  const handleCreateScope = async (
    data: CreateDataScopeInput,
    onSuccess?: () => void
  ) => {
    try {
      await createMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by onError
      console.error(error);
    }
  };

  const handleUpdateScope = async (
    scopeId: number | string,
    data: UpdateDataScopeInput,
    onSuccess?: () => void
  ) => {
    try {
      await updateMutation.mutateAsync({ scopeId: String(scopeId), data });
      onSuccess?.();
    } catch (error) {
      // Error is handled by onError
      console.error(error);
    }
  };

  const handleDeleteScope = async (
    scopeId: number | string,
    onSuccess?: () => void
  ) => {
    try {
      await deleteMutation.mutateAsync(String(scopeId));
      onSuccess?.();
    } catch (error) {
      // Error is handled by onError
      console.error(error);
    }
  };

  return {
    scopes,
    scopesLoading,
    scopesError,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    selectedScope,
    setSelectedScope,
    handleCreateScope,
    handleUpdateScope,
    handleDeleteScope,
    apiError,
    errorDialogOpen,
    setErrorDialogOpen,
  };
}
