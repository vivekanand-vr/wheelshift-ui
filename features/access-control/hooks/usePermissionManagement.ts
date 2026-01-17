"use client";

/**
 * Permission Management Hook
 * Handles permission CRUD operations
 */

import { useState } from "react";
import { usePermissions, useCreatePermission } from "../api";
import type { Permission, PermissionRequest } from "../types";

export function usePermissionManagement() {
  const [search, setSearch] = useState("");

  // Queries
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions();

  // Mutations
  const createPermissionMutation = useCreatePermission();

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

  // Handlers
  const handleCreatePermission = (
    data: PermissionRequest,
    onSuccess?: () => void
  ) => {
    createPermissionMutation.mutate(data, {
      onSuccess,
    });
  };

  const reset = () => {
    setSearch("");
  };

  return {
    // State
    search,
    permissions,
    filteredPermissions,
    groupedPermissions,

    // Loading states
    permissionsLoading,
    isCreating: createPermissionMutation.isPending,

    // Actions
    setSearch,
    handleCreatePermission,
    reset,
  };
}
