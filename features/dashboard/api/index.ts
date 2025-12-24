import api from "@/lib/api/axios";

import type {
  AdminDashboardResponse,
  SalesDashboardResponse,
  InspectorDashboardResponse,
  FinanceDashboardResponse,
  StoreManagerDashboardResponse,
  DashboardResponse,
} from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const dashboardApi = {
  // Get current user's dashboard (auto-detects role)
  getCurrentUserDashboard: async (): Promise<DashboardResponse> => {
    const response =
      await api.get<ApiResponse<DashboardResponse>>("/dashboard/me");
    return response.data.data;
  },

  // Role-specific dashboard endpoints
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    const response =
      await api.get<ApiResponse<AdminDashboardResponse>>("/dashboard/admin");
    return response.data.data;
  },

  getSalesDashboard: async (): Promise<SalesDashboardResponse> => {
    const response =
      await api.get<ApiResponse<SalesDashboardResponse>>("/dashboard/sales");
    return response.data.data;
  },

  getInspectorDashboard: async (): Promise<InspectorDashboardResponse> => {
    const response = await api.get<ApiResponse<InspectorDashboardResponse>>(
      "/dashboard/inspector"
    );
    return response.data.data;
  },

  getFinanceDashboard: async (): Promise<FinanceDashboardResponse> => {
    const response =
      await api.get<ApiResponse<FinanceDashboardResponse>>(
        "/dashboard/finance"
      );
    return response.data.data;
  },

  getStoreManagerDashboard:
    async (): Promise<StoreManagerDashboardResponse> => {
      const response = await api.get<
        ApiResponse<StoreManagerDashboardResponse>
      >("/dashboard/store-manager");
      return response.data.data;
    },
};
