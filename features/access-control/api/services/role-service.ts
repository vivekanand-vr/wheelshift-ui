import { api } from "@/lib/api/axios";
import { Role, RoleRequest } from "../../types";

export const roleService = {
  /**
   * Get all roles
   */
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get(`/rbac/roles`);
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRoleById: async (roleId: number): Promise<Role> => {
    const response = await api.get(`/rbac/roles/${roleId}`);
    return response.data;
  },

  /**
   * Create a new role (SUPER_ADMIN only)
   */
  createRole: async (data: RoleRequest): Promise<Role> => {
    const response = await api.post(`/rbac/roles`, data);
    return response.data;
  },

  /**
   * Update a role (SUPER_ADMIN only)
   */
  updateRole: async (roleId: number, data: RoleRequest): Promise<Role> => {
    const response = await api.put(`/rbac/roles/${roleId}`, data);
    return response.data;
  },

  /**
   * Delete a role (SUPER_ADMIN only, cannot delete system roles)
   */
  deleteRole: async (roleId: number): Promise<void> => {
    await api.delete(`/rbac/roles/${roleId}`);
  },

  /**
   * Add permission to role
   */
  addPermissionToRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    await api.post(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },

  /**
   * Remove permission from role
   */
  removePermissionFromRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    await api.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },
};
