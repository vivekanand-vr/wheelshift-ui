/**
 * React Query Hooks for Access Control
 */

import { useQuery } from "@tanstack/react-query";
import {
  roleService,
  permissionService,
  employeeRoleService,
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
  dataScopes: () => [...accessControlKeys.all, "data-scopes"] as const,
  dataScopesByEmployee: (employeeId: number) =>
    [...accessControlKeys.dataScopes(), "employee", employeeId] as const,
  resourceACLs: (resourceType: string, resourceId: number) =>
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

// ============================================================================
// DATA SCOPE QUERIES
// ============================================================================

export const useDataScopes = () => {
  return useQuery({
    queryKey: accessControlKeys.dataScopes(),
    queryFn: dataScopeService.getAllDataScopes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDataScopesByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: accessControlKeys.dataScopesByEmployee(employeeId),
    queryFn: () => dataScopeService.getDataScopesByEmployee(employeeId),
    enabled: !!employeeId,
  });
};

// ============================================================================
// RESOURCE ACL QUERIES
// ============================================================================

export const useResourceACLs = (
  resourceType: ResourceType,
  resourceId: number
) => {
  return useQuery({
    queryKey: accessControlKeys.resourceACLs(resourceType, resourceId),
    queryFn: () => resourceACLService.getResourceACLs(resourceType, resourceId),
    enabled: !!resourceType && !!resourceId,
  });
};
