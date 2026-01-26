"use client";

/**
 * Employee Custom Permissions Management Hook
 * Handles all employee custom permission assignment logic
 */

import { useState } from "react";
import {
  useEmployeeCustomPermissions as useCustomPermissionsQuery,
  useEmployeeAllPermissions,
  usePermissions,
  useAssignPermissionToEmployee,
  useRemovePermissionFromEmployee,
  useRemoveAllCustomPermissions,
} from "../api";
import type { Employee } from "@/types";
import type { Permission } from "../types";

export function useEmployeeCustomPermissions(employeeId?: number) {
  const [search, setSearch] = useState("");
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [reason, setReason] = useState("");
  const [permissionToRemove, setPermissionToRemove] =
    useState<Permission | null>(null);

  // Queries
  const {
    data: customPermissions = [],
    isLoading: customPermissionsLoading,
    refetch: refetchCustomPermissions,
  } = useCustomPermissionsQuery(employeeId || 0);

  const {
    data: employeeAllPermissions = [],
    isLoading: employeeAllPermissionsLoading,
  } = useEmployeeAllPermissions(employeeId || 0);

  const { data: allPermissions = [], isLoading: allPermissionsLoading } =
    usePermissions();

  // Mutations
  const assignMutation = useAssignPermissionToEmployee();
  const removeMutation = useRemovePermissionFromEmployee();
  const removeAllMutation = useRemoveAllCustomPermissions();

  // Get IDs of custom permissions already assigned
  const assignedPermissionIds = new Set(
    customPermissions.map((ep) => ep.permissionId)
  );

  // Filter available permissions (not already assigned)
  const filteredPermissions = allPermissions.filter(
    (permission) =>
      !assignedPermissionIds.has(permission.id) &&
      (search === "" ||
        permission.name.toLowerCase().includes(search.toLowerCase()) ||
        permission.resource.toLowerCase().includes(search.toLowerCase()) ||
        permission.action.toLowerCase().includes(search.toLowerCase()))
  );

  // Group permissions by resource for better organization
  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      const resource = permission.resource;
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Handlers
  const handleAssignPermission = async (
    employee: Employee,
    permissionId: number,
    reasonText?: string
  ) => {
    if (!employee) return;

    await assignMutation.mutateAsync({
      employeeId: employee.id,
      data: {
        permissionId,
        reason: reasonText || undefined,
      },
    });

    // Reset state
    setSelectedPermission(null);
    setReason("");
    setSearch("");
  };

  const handleRemovePermission = async (
    employee: Employee,
    permissionId: number
  ) => {
    if (!employee) return;

    await removeMutation.mutateAsync({
      employeeId: employee.id,
      permissionId,
    });

    setPermissionToRemove(null);
  };

  const handleRemoveAllPermissions = async (employee: Employee) => {
    if (!employee) return;

    await removeAllMutation.mutateAsync(employee.id);
  };

  const reset = () => {
    setSearch("");
    setSelectedPermission(null);
    setReason("");
    setPermissionToRemove(null);
  };

  return {
    // State
    search,
    selectedPermission,
    reason,
    permissionToRemove,
    customPermissions,
    employeeAllPermissions,
    availablePermissions: filteredPermissions,
    groupedPermissions,

    // Loading states
    customPermissionsLoading,
    employeeAllPermissionsLoading,
    allPermissionsLoading,
    isAssigning: assignMutation.isPending,
    isRemoving: removeMutation.isPending,
    isRemovingAll: removeAllMutation.isPending,

    // Actions
    setSearch,
    setSelectedPermission,
    setReason,
    setPermissionToRemove,
    handleAssignPermission,
    handleRemovePermission,
    handleRemoveAllPermissions,
    refetchCustomPermissions,
    reset,
  };
}
