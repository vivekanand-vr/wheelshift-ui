/**
 * Access Control API Services
 * Handles all RBAC-related API calls
 */

import axios from "@/lib/api/axios";
import type { ApiResponse, Employee } from "@/types";
import type {
  Role,
  Permission,
  EmployeeDataScope,
  ResourceACL,
  RoleRequest,
  PermissionRequest,
  DataScopeRequest,
  ResourceACLRequest,
  AssignRoleRequest,
  ResourceType,
} from "../types";

// Backend response wrapper type

// Paginated response type
interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// ============================================================================
// ROLE SERVICES
// ============================================================================

export const roleService = {
  /**
   * Get all roles
   */
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axios.get(`/rbac/roles`);
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRoleById: async (roleId: number): Promise<Role> => {
    const response = await axios.get(`/rbac/roles/${roleId}`);
    return response.data;
  },

  /**
   * Create a new role (SUPER_ADMIN only)
   */
  createRole: async (data: RoleRequest): Promise<Role> => {
    const response = await axios.post(`/rbac/roles`, data);
    return response.data;
  },

  /**
   * Update a role (SUPER_ADMIN only)
   */
  updateRole: async (roleId: number, data: RoleRequest): Promise<Role> => {
    const response = await axios.put(`/rbac/roles/${roleId}`, data);
    return response.data;
  },

  /**
   * Delete a role (SUPER_ADMIN only, cannot delete system roles)
   */
  deleteRole: async (roleId: number): Promise<void> => {
    await axios.delete(`/rbac/roles/${roleId}`);
  },

  /**
   * Add permission to role
   */
  addPermissionToRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    await axios.post(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },

  /**
   * Remove permission from role
   */
  removePermissionFromRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    await axios.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },
};

// ============================================================================
// PERMISSION SERVICES
// ============================================================================

export const permissionService = {
  /**
   * Get all permissions
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await axios.get(`/rbac/permissions`);
    return response.data;
  },

  /**
   * Get permission by ID
   */
  getPermissionById: async (permissionId: number): Promise<Permission> => {
    const response = await axios.get(`/rbac/permissions/${permissionId}`);
    return response.data;
  },

  /**
   * Create a new permission (SUPER_ADMIN only)
   */
  createPermission: async (data: PermissionRequest): Promise<Permission> => {
    const response = await axios.post(`/rbac/permissions`, data);
    return response.data;
  },

  /**
   * Update a permission (SUPER_ADMIN only)
   */
  updatePermission: async (
    permissionId: number,
    data: PermissionRequest
  ): Promise<Permission> => {
    const response = await axios.put(`/rbac/permissions/${permissionId}`, data);
    return response.data;
  },

  /**
   * Delete a permission (SUPER_ADMIN only)
   */
  deletePermission: async (permissionId: number): Promise<void> => {
    await axios.delete(`/rbac/permissions/${permissionId}`);
  },
};

// ============================================================================
// EMPLOYEE ROLE SERVICES
// ============================================================================

export const employeeRoleService = {
  /**
   * Get employee's permissions
   */
  getEmployeePermissions: async (employeeId: number): Promise<Permission[]> => {
    const response = await axios.get(`/employees/${employeeId}/permissions`);
    return response.data;
  },

  /**
   * Get employee's roles
   */
  getEmployeeRoles: async (employeeId: number): Promise<Role[]> => {
    const response = await axios.get(`/rbac/employees/${employeeId}/roles`);
    return response.data;
  },

  /**
   * Assign role to employee
   */
  assignRoleToEmployee: async (
    employeeId: number,
    roleId: number
  ): Promise<void> => {
    await axios.post(`/rbac/employees/${employeeId}/roles/${roleId}`);
  },

  /**
   * Remove role from employee
   */
  removeRoleFromEmployee: async (
    employeeId: number,
    roleId: number
  ): Promise<void> => {
    await axios.delete(`/rbac/employees/${employeeId}/roles/${roleId}`);
  },

  /**
   * Assign roles to employee (bulk)
   */
  assignRolesToEmployee: async (
    employeeId: number,
    data: AssignRoleRequest
  ): Promise<void> => {
    await axios.post(`/employees/${employeeId}/roles`, data);
  },

  /**
   * Get all employees (for role assignment)
   */
  getAllEmployees: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginatedResponse<Employee>> => {
    const queryParams = new URLSearchParams();
    // API uses 0-indexed pages, so subtract 1 from the UI page number
    if (params?.page) queryParams.append("page", (params.page - 1).toString());
    // API uses 'size' parameter instead of 'pageSize'
    if (params?.pageSize)
      queryParams.append("size", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await axios.get<ApiResponse<PaginatedResponse<Employee>>>(
      `/employees?${queryParams.toString()}`
    );

    // Return full paginated response
    return response.data.data;
  },
};

// ============================================================================
// DATA SCOPE SERVICES
// ============================================================================

export const dataScopeService = {
  /**
   * Get data scopes by employee ID
   * GET /api/v1/rbac/employees/{employeeId}/scopes
   */
  getDataScopesByEmployee: async (
    employeeId: string
  ): Promise<EmployeeDataScope[]> => {
    const response = await axios.get(`/rbac/employees/${employeeId}/scopes`);
    return response.data;
  },

  /**
   * Create data scope for employee
   * POST /api/v1/rbac/employees/{employeeId}/scopes
   */
  createDataScope: async (
    employeeId: string,
    data: DataScopeRequest
  ): Promise<EmployeeDataScope> => {
    const response = await axios.post(
      `/rbac/employees/${employeeId}/scopes`,
      data
    );
    return response.data;
  },

  /**
   * Update data scope
   * PUT /api/v1/rbac/employees/scopes/{scopeId}
   */
  updateDataScope: async (
    scopeId: string,
    data: Partial<DataScopeRequest>
  ): Promise<EmployeeDataScope> => {
    const response = await axios.put(`/rbac/employees/scopes/${scopeId}`, data);
    return response.data;
  },

  /**
   * Delete data scope
   * DELETE /api/v1/rbac/employees/scopes/{scopeId}
   */
  deleteDataScope: async (scopeId: string): Promise<void> => {
    await axios.delete(`/rbac/employees/scopes/${scopeId}`);
  },

  /**
   * Get data scope by ID
   * GET /api/v1/rbac/employees/scopes/{scopeId}
   */
  getDataScopeById: async (scopeId: string): Promise<EmployeeDataScope> => {
    const response = await axios.get(`/rbac/employees/scopes/${scopeId}`);
    return response.data;
  },
};

// ============================================================================
// RESOURCE ACL SERVICES
// ============================================================================

export const resourceACLService = {
  /**
   * Get ACLs for a specific resource
   * GET /api/v1/rbac/acl/resource/{resourceType}/{resourceId}
   */
  getResourceACLs: async (
    resourceType: ResourceType,
    resourceId: string
  ): Promise<ResourceACL[]> => {
    const response = await axios.get(`/rbac/acl/${resourceType}/${resourceId}`);
    return response.data;
  },

  /**
   * Grant access to a resource for an employee or role
   * POST /api/v1/rbac/acl
   */
  grantResourceAccess: async (
    data: ResourceACLRequest
  ): Promise<ResourceACL> => {
    const response = await axios.post(`/rbac/acl`, data);
    return response.data;
  },

  /**
   * Update access level for an ACL
   * PUT /api/v1/rbac/acl/{id}
   */
  updateResourceAccess: async (
    id: number,
    data: ResourceACLRequest
  ): Promise<ResourceACL> => {
    const response = await axios.put(`/rbac/acl/${id}`, data);
    return response.data;
  },

  /**
   * Remove ACL entry
   * DELETE /api/v1/rbac/acl/{id}
   */
  revokeResourceAccess: async (id: number): Promise<void> => {
    await axios.delete(`/rbac/acl/${id}`);
  },
};
