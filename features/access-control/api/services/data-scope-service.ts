import { api } from "@/lib/api/axios";
import { EmployeeDataScope, DataScopeRequest } from "../../types";

export const dataScopeService = {
  /**
   * Get data scopes by employee ID
   * GET /api/v1/rbac/employees/{employeeId}/scopes
   */
  getDataScopesByEmployee: async (
    employeeId: string
  ): Promise<EmployeeDataScope[]> => {
    const response = await api.get(`/rbac/employees/${employeeId}/scopes`);
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
    const response = await api.post(
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
    const response = await api.put(`/rbac/employees/scopes/${scopeId}`, data);
    return response.data;
  },

  /**
   * Delete data scope
   * DELETE /api/v1/rbac/employees/scopes/{scopeId}
   */
  deleteDataScope: async (scopeId: string): Promise<void> => {
    await api.delete(`/rbac/employees/scopes/${scopeId}`);
  },

  /**
   * Get data scope by ID
   * GET /api/v1/rbac/employees/scopes/{scopeId}
   */
  getDataScopeById: async (scopeId: string): Promise<EmployeeDataScope> => {
    const response = await api.get(`/rbac/employees/scopes/${scopeId}`);
    return response.data;
  },
};
