/**
 * React Query Hooks for Access Control
 */

import { useQuery } from "@tanstack/react-query";
import {
  roleService,
  permissionService,
  employeeRoleService,
  employeePermissionService,
  dataScopeService,
  resourceACLService,
} from "./services";
import type { ResourceType } from "../types";

// Query keys
export const accessControlKeys = {
  all: ["access-control"] as const,
  roles: () => [...accessControlKeys.all, "roles"] as const,
  role: (id: number) => [...accessControlKeys.roles(), id] as const,
  permissions: () => [...accessControlKeys.all, "permissions"] as const,
  permission: (id: number) => [...accessControlKeys.permissions(), id] as const,
  employees: () => [...accessControlKeys.all, "employees"] as const,
  employeePermissions: (employeeId: number) =>
    [...accessControlKeys.employees(), employeeId, "permissions"] as const,
  employeeCustomPermissions: (employeeId: number) =>
    [
      ...accessControlKeys.employees(),
      employeeId,
      "custom-permissions",
    ] as const,
  employeeAllPermissions: (employeeId: number) =>
    [...accessControlKeys.employees(), employeeId, "all-permissions"] as const,
  dataScopes: () => [...accessControlKeys.all, "data-scopes"] as const,
  dataScopesByEmployee: (employeeId: number) =>
    [...accessControlKeys.dataScopes(), "employee", employeeId] as const,
  resourceACLs: (resourceType: string, resourceId: string) =>
    [...accessControlKeys.all, "acl", resourceType, resourceId] as const,
};

// ============================================================================
// ROLE QUERIES
// ============================================================================

export const useRoles = () => {
  return useQuery({
    queryKey: accessControlKeys.roles(),
    queryFn: roleService.getAllRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRole = (roleId: number) => {
  return useQuery({
    queryKey: accessControlKeys.role(roleId),
    queryFn: () => roleService.getRoleById(roleId),
    enabled: !!roleId,
  });
};

// ============================================================================
// PERMISSION QUERIES
// ============================================================================

export const usePermissions = () => {
  return useQuery({
    queryKey: accessControlKeys.permissions(),
    queryFn: permissionService.getAllPermissions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePermission = (permissionId: number) => {
  return useQuery({
    queryKey: accessControlKeys.permission(permissionId),
    queryFn: () => permissionService.getPermissionById(permissionId),
    enabled: !!permissionId,
  });
};

// ============================================================================
// EMPLOYEE QUERIES
// ============================================================================

export const useEmployees = () => {
  return useQuery({
    queryKey: accessControlKeys.employees(),
    queryFn: () => employeeRoleService.getAllEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployeePermissions = (employeeId: number) => {
  return useQuery({
    queryKey: accessControlKeys.employeePermissions(employeeId),
    queryFn: () => employeeRoleService.getEmployeePermissions(employeeId),
    enabled: !!employeeId,
  });
};

export const useEmployeeCustomPermissions = (employeeId: number) => {
  return useQuery({
    queryKey: accessControlKeys.employeeCustomPermissions(employeeId),
    queryFn: () =>
      employeePermissionService.getEmployeeCustomPermissions(employeeId),
    enabled: !!employeeId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useEmployeeAllPermissions = (employeeId: number) => {
  return useQuery({
    queryKey: accessControlKeys.employeeAllPermissions(employeeId),
    queryFn: () => permissionService.getEmployeeAllPermissions(employeeId),
    enabled: !!employeeId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// ============================================================================
// DATA SCOPE QUERIES
// ============================================================================

export const useDataScopesByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: accessControlKeys.dataScopesByEmployee(employeeId),
    queryFn: () => dataScopeService.getDataScopesByEmployee(String(employeeId)),
    enabled: !!employeeId,
  });
};

// ============================================================================
// RESOURCE ACL QUERIES
// ============================================================================

export const useResourceACLs = (
  resourceType: ResourceType,
  resourceId: string
) => {
  return useQuery({
    queryKey: accessControlKeys.resourceACLs(resourceType, resourceId),
    queryFn: () => resourceACLService.getResourceACLs(resourceType, resourceId),
    enabled: !!resourceType && !!resourceId,
  });
};
