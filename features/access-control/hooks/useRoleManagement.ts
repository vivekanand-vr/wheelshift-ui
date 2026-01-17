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
import type { Role, RoleRequest } from "../types";

export function useRoleManagement() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

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

  // Handlers
  const handleCreateRole = (data: RoleRequest, onSuccess?: () => void) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedRole(null);
      },
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
      }
    );
  };

  const handleDeleteRole = (onSuccess?: () => void) => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete.id, {
        onSuccess: () => {
          onSuccess?.();
          setRoleToDelete(null);
        },
      });
    }
  };

  const handleAddPermission = (roleId: number, permissionId: number) => {
    addPermissionMutation.mutate({ roleId, permissionId });
  };

  const handleRemovePermission = (roleId: number, permissionId: number) => {
    removePermissionMutation.mutate({ roleId, permissionId });
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
