import { api } from "@/lib/api/axios";
import { EmployeePermission, EmployeePermissionRequest } from "../../types";

export const employeePermissionService = {
  /**
   * Get employee's custom permissions
   * GET /api/v1/rbac/employee-permissions/employees/{employeeId}
   */
  getEmployeeCustomPermissions: async (
    employeeId: number
  ): Promise<EmployeePermission[]> => {
    const response = await api.get(
      `/rbac/employee-permissions/employees/${employeeId}`
    );
    return response.data;
  },

  /**
   * Assign custom permission to employee
   * POST /api/v1/rbac/employee-permissions/employees/{employeeId}
   */
  assignPermissionToEmployee: async (
    employeeId: number,
    data: EmployeePermissionRequest
  ): Promise<EmployeePermission> => {
    const response = await api.post(
      `/rbac/employee-permissions/employees/${employeeId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove custom permission from employee
   * DELETE /api/v1/rbac/employee-permissions/employees/{employeeId}/permissions/{permissionId}
   */
  removePermissionFromEmployee: async (
    employeeId: number,
    permissionId: number
  ): Promise<void> => {
    await api.delete(
      `/rbac/employee-permissions/employees/${employeeId}/permissions/${permissionId}`
    );
  },

  /**
   * Remove all custom permissions from employee
   * DELETE /api/v1/rbac/employee-permissions/employees/{employeeId}
   */
  removeAllCustomPermissions: async (employeeId: number): Promise<void> => {
    await api.delete(`/rbac/employee-permissions/employees/${employeeId}`);
  },

  /**
   * Get employee permission by ID
   * GET /api/v1/rbac/employee-permissions/{id}
   */
  getEmployeePermissionById: async (
    id: number
  ): Promise<EmployeePermission> => {
    const response = await api.get(`/rbac/employee-permissions/${id}`);
    return response.data;
  },
};
