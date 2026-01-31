import { Employee, ApiResponse } from "@/types";
import { api } from "@/lib/api/axios";
import { Permission, Role, AssignRoleRequest } from "../../types";

interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export const employeeRoleService = {
  /**
   * Get employee's permissions
   */
  getEmployeePermissions: async (employeeId: number): Promise<Permission[]> => {
    const response = await api.get(`/employees/${employeeId}/permissions`);
    return response.data;
  },

  /**
   * Get employee's roles
   */
  getEmployeeRoles: async (employeeId: number): Promise<Role[]> => {
    const response = await api.get(`/rbac/employees/${employeeId}/roles`);
    return response.data;
  },

  /**
   * Assign role to employee
   */
  assignRoleToEmployee: async (
    employeeId: number,
    roleId: number
  ): Promise<void> => {
    await api.post(`/rbac/employees/${employeeId}/roles/${roleId}`);
  },

  /**
   * Remove role from employee
   */
  removeRoleFromEmployee: async (
    employeeId: number,
    roleId: number
  ): Promise<void> => {
    await api.delete(`/rbac/employees/${employeeId}/roles/${roleId}`);
  },

  /**
   * Assign roles to employee (bulk)
   */
  assignRolesToEmployee: async (
    employeeId: number,
    data: AssignRoleRequest
  ): Promise<void> => {
    await api.post(`/employees/${employeeId}/roles`, data);
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

    const response = await api.get<ApiResponse<PaginatedResponse<Employee>>>(
      `/employees?${queryParams.toString()}`
    );

    // Return full paginated response
    return response.data.data;
  },
};
