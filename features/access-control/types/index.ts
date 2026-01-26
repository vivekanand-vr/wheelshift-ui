/**
 * Access Control Feature Types
 * Matches backend RBAC entities
 */

// Re-export API error type from global types
export type { ApiErrorResponse } from "@/types";

export type RoleType =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SALES"
  | "INSPECTOR"
  | "FINANCE"
  | "STORE_MANAGER"
  | string; // Allow custom roles

export type ResourceType =
  | "CAR"
  | "CAR_MODEL"
  | "CLIENT"
  | "EMPLOYEE"
  | "INQUIRY"
  | "RESERVATION"
  | "SALE"
  | "TRANSACTION"
  | "INSPECTION"
  | "LOCATION"
  | "TASK"
  | "EVENT"
  | "ROLE"
  | "PERMISSION"
  | "ACL"
  | "NOTIFICATION";

export type AccessLevel = "READ" | "WRITE" | "ADMIN";

export type SubjectType = "EMPLOYEE" | "ROLE" | "DEPARTMENT";

export type ScopeType = "LOCATION" | "DEPARTMENT" | "ASSIGNMENT";

export type ScopeEffect = "INCLUDE" | "EXCLUDE";

export interface Permission {
  id: number;
  resource: string;
  action: string;
  name: string; // Auto-generated: resource:action
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: RoleType;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDataScope {
  id: number;
  employeeId: number;
  scopeType: ScopeType;
  scopeValue: string;
  effect: ScopeEffect;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceACL {
  id: number;
  resourceType: ResourceType;
  resourceId: string; // Changed from number to string (e.g., "CAR-123")
  subjectType: SubjectType;
  subjectId: number;
  accessLevel: AccessLevel; // Changed from 'access' to 'accessLevel'
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRole {
  employeeId: number;
  roleIds: number[];
}

// Request/Response DTOs
export interface RoleRequest {
  name: string;
  description?: string;
  isSystem?: boolean;
}

export type RoleResponse = Role;

export interface PermissionRequest {
  resource: string;
  action: string;
  description?: string;
}

export type PermissionResponse = Permission;

// Export alias for DataScope
export type DataScope = EmployeeDataScope;

// Request types for data scopes
export interface CreateDataScopeInput {
  scopeType: ScopeType;
  scopeValue: string;
  effect: ScopeEffect;
  description?: string;
}

export interface UpdateDataScopeInput {
  effect?: ScopeEffect;
  description?: string;
}

export interface DataScopeRequest {
  employeeId?: number;
  scopeType: ScopeType;
  scopeValue: string;
  effect: ScopeEffect;
  description?: string;
}

export type DataScopeResponse = EmployeeDataScope;

export interface ResourceACLRequest {
  resourceType: ResourceType;
  resourceId: string; // Changed from number to string
  subjectType: SubjectType;
  subjectId: number;
  accessLevel: AccessLevel; // Changed from 'access' to 'accessLevel'
}

export type ResourceACLResponse = ResourceACL;

export interface AssignRoleRequest {
  roleIds: number[];
}

export interface EmployeePermission {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  permissionId: number;
  permissionName: string;
  permissionResource: string;
  permissionAction: string;
  grantedBy: number;
  grantedByName: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePermissionRequest {
  permissionId: number;
  reason?: string;
}

export type EmployeePermissionResponse = EmployeePermission;

// UI-specific types
export interface RoleWithStats extends Role {
  employeeCount?: number;
  permissionCount: number;
}

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

export type AccessControlTab =
  | "roles"
  | "permissions"
  | "employees"
  | "data-scopes"
  | "acls";

export interface AccessControlFilters {
  search: string;
  roleType?: RoleType | "all";
  resourceType?: string | "all";
}
