import { api } from "@/lib/api/axios";
import { Permission, PermissionRequest } from "../../types";

export const permissionService = {
  /**
   * Get all permissions
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get(`/rbac/permissions`);
    return response.data;
  },

  /**
   * Get permission by ID
   */
  getPermissionById: async (permissionId: number): Promise<Permission> => {
    const response = await api.get(`/rbac/permissions/${permissionId}`);
    return response.data;
  },

  /**
   * Get all permissions for a specific employee (both custom and role-based)
   * GET /api/v1/rbac/permissions/employee/{employeeId}
   */
  getEmployeeAllPermissions: async (
    employeeId: number
  ): Promise<Permission[]> => {
    const response = await api.get(`/rbac/permissions/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Create a new permission (SUPER_ADMIN only)
   */
  createPermission: async (data: PermissionRequest): Promise<Permission> => {
    const response = await api.post(`/rbac/permissions`, data);
    return response.data;
  },

  /**
   * Update a permission (SUPER_ADMIN only)
   */
  updatePermission: async (
    permissionId: number,
    data: PermissionRequest
  ): Promise<Permission> => {
    const response = await api.put(`/rbac/permissions/${permissionId}`, data);
    return response.data;
  },

  /**
   * Delete a permission (SUPER_ADMIN only)
   */
  deletePermission: async (permissionId: number): Promise<void> => {
    await api.delete(`/rbac/permissions/${permissionId}`);
  },
};
