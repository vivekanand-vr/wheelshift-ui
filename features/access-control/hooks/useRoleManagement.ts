"use client";

/**
 * Role Management Hook
 * Handles all role CRUD operations and permission management
 */

import { useState } from "react";
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAddPermissionToRole,
  useRemovePermissionFromRole,
} from "../api";
import type { Role, RoleRequest, ApiErrorResponse } from "../types";

export function useRoleManagement() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Queries
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions();

  // Mutations
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const addPermissionMutation = useAddPermissionToRole();
  const removePermissionMutation = useRemovePermissionFromRole();

  // Filter roles based on search
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Error handler
  const handleApiError = (error: any) => {
    // Check if error response has the expected structure
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
  const handleCreateRole = (data: RoleRequest, onSuccess?: () => void) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedRole(null);
      },
      onError: handleApiError,
    });
  };

  const handleUpdateRole = (
    roleId: number,
    data: RoleRequest,
    onSuccess?: () => void
  ) => {
    updateRoleMutation.mutate(
      { roleId, data },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedRole(null);
        },
        onError: handleApiError,
      }
    );
  };

  const handleDeleteRole = (roleId: number, onSuccess?: () => void) => {
    deleteRoleMutation.mutate(roleId, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedRole(null);
      },
      onError: handleApiError,
    });
  };

  const handleAddPermission = (roleId: number, permissionId: number) => {
    addPermissionMutation.mutate(
      { roleId, permissionId },
      { onError: handleApiError }
    );
  };

  const handleRemovePermission = (roleId: number, permissionId: number) => {
    removePermissionMutation.mutate(
      { roleId, permissionId },
      { onError: handleApiError }
    );
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
  };

  const openDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
  };

  const reset = () => {
    setSearch("");
    setSelectedRole(null);
    setRoleToDelete(null);
  };

  return {
    // State
    search,
    selectedRole,
    roleToDelete,
    roles,
    filteredRoles,
    permissions,
    apiError,
    errorDialogOpen,

    // Loading states
    rolesLoading,
    permissionsLoading,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
    isManagingPermissions:
      addPermissionMutation.isPending || removePermissionMutation.isPending,

    // Actions
    setSearch,
    setSelectedRole,
    setRoleToDelete,
    setErrorDialogOpen,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleAddPermission,
    handleRemovePermission,
    openEditDialog,
    openDeleteDialog,
    reset,
  };
}
