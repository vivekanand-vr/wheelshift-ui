"use client";

/**
 * Permission Management Hook
 * Handles permission CRUD operations
 */

import { useState } from "react";
import {
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "../api";
import type { Permission, PermissionRequest, ApiErrorResponse } from "../types";

export function usePermissionManagement() {
  const [search, setSearch] = useState("");
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Queries
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions();

  // Mutations
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  // Filter permissions based on search
  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group permissions by resource
  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

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

  // Handlers
  const handleCreatePermission = (
    data: PermissionRequest,
    onSuccess?: () => void
  ) => {
    createPermissionMutation.mutate(data, {
      onSuccess,
      onError: handleApiError,
    });
  };

  const handleUpdatePermission = (
    permissionId: number,
    data: PermissionRequest,
    onSuccess?: () => void
  ) => {
    updatePermissionMutation.mutate(
      { permissionId, data },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedPermission(null);
        },
        onError: handleApiError,
      }
    );
  };

  const handleDeletePermission = (
    permissionId: number,
    onSuccess?: () => void
  ) => {
    deletePermissionMutation.mutate(permissionId, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedPermission(null);
      },
      onError: handleApiError,
    });
  };

  const reset = () => {
    setSearch("");
    setSelectedPermission(null);
  };

  return {
    // State
    search,
    selectedPermission,
    permissions,
    filteredPermissions,
    groupedPermissions,
    apiError,
    errorDialogOpen,

    // Loading states
    permissionsLoading,
    isCreating: createPermissionMutation.isPending,
    isUpdating: updatePermissionMutation.isPending,
    isDeleting: deletePermissionMutation.isPending,

    // Actions
    setSearch,
    setSelectedPermission,
    setErrorDialogOpen,
    handleCreatePermission,
    handleUpdatePermission,
    handleDeletePermission,
    reset,
  };
}
