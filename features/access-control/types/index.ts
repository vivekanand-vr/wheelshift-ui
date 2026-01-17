/**
 * Access Control Feature Types
 * Matches backend RBAC entities
 */

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
  resourceId: number;
  subjectType: SubjectType;
  subjectId: number;
  access: AccessLevel;
  reason?: string;
  grantedBy: number;
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

export interface DataScopeRequest {
  employeeId: number;
  scopeType: ScopeType;
  scopeValue: string;
  effect: ScopeEffect;
  description?: string;
}

export type DataScopeResponse = EmployeeDataScope;

export interface ResourceACLRequest {
  resourceType: ResourceType;
  resourceId: number;
  subjectType: SubjectType;
  subjectId: number;
  access: AccessLevel;
  reason?: string;
}

export type ResourceACLResponse = ResourceACL;

export interface AssignRoleRequest {
  roleIds: number[];
}

// UI-specific types
export interface RoleWithStats extends Role {
  employeeCount?: number;
  permissionCount: number;
}

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

export type AccessControlTab = "roles" | "permissions" | "employees" | "scopes";

export interface AccessControlFilters {
  search: string;
  roleType?: RoleType | "all";
  resourceType?: string | "all";
}
