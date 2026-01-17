/**
 * Access Control API Services
 * Handles all RBAC-related API calls
 */

import axios from "@/lib/api/axios";
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
} from "../types";

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

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

// Employee type for role assignment
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
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
   * Assign roles to employee
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
  }): Promise<Employee[]> => {
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

    // Extract content array from paginated response
    return response.data.data.content || [];
  },
};

// ============================================================================
// DATA SCOPE SERVICES
// ============================================================================

export const dataScopeService = {
  /**
   * Get all data scopes
   */
  getAllDataScopes: async (): Promise<EmployeeDataScope[]> => {
    const response = await axios.get(`/rbac/data-scopes`);
    return response.data;
  },

  /**
   * Get data scopes by employee ID
   */
  getDataScopesByEmployee: async (
    employeeId: number
  ): Promise<EmployeeDataScope[]> => {
    const response = await axios.get(
      `/rbac/data-scopes/employee/${employeeId}`
    );
    return response.data;
  },

  /**
   * Create data scope
   */
  createDataScope: async (
    data: DataScopeRequest
  ): Promise<EmployeeDataScope> => {
    const response = await axios.post(`/rbac/data-scopes`, data);
    return response.data;
  },

  /**
   * Update data scope
   */
  updateDataScope: async (
    scopeId: number,
    data: DataScopeRequest
  ): Promise<EmployeeDataScope> => {
    const response = await axios.put(`/rbac/data-scopes/${scopeId}`, data);
    return response.data;
  },

  /**
   * Delete data scope
   */
  deleteDataScope: async (scopeId: number): Promise<void> => {
    await axios.delete(`/rbac/data-scopes/${scopeId}`);
  },
};

// ============================================================================
// RESOURCE ACL SERVICES
// ============================================================================

export const resourceACLService = {
  /**
   * Get ACLs for a specific resource
   */
  getResourceACLs: async (
    resourceType: string,
    resourceId: number
  ): Promise<ResourceACL[]> => {
    const response = await axios.get(`/rbac/acl/${resourceType}/${resourceId}`);
    return response.data;
  },

  /**
   * Create resource ACL
   */
  createResourceACL: async (data: ResourceACLRequest): Promise<ResourceACL> => {
    const response = await axios.post(`/rbac/acl`, data);
    return response.data;
  },

  /**
   * Delete resource ACL
   */
  deleteResourceACL: async (aclId: number): Promise<void> => {
    await axios.delete(`/rbac/acl/${aclId}`);
  },
};
