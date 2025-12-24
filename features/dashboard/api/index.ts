import { store } from "@/lib/redux/store";

import type {
  AdminDashboardResponse,
  SalesDashboardResponse,
  InspectorDashboardResponse,
  FinanceDashboardResponse,
  StoreManagerDashboardResponse,
  DashboardResponse,
} from "../types";

// Import mock data
import {
  mockAdminDashboard,
  mockSalesDashboard,
  mockInspectorDashboard,
  mockFinanceDashboard,
  mockStoreManagerDashboard,
} from "./mockData";

// TODO: Uncomment when backend is ready
// import { api } from "@/lib/api/apiClient";
// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
//   timestamp: string;
// }

// Helper to simulate API delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  // Get current user's dashboard (auto-detects role)
  getCurrentUserDashboard: async (): Promise<DashboardResponse> => {
    // TODO: Uncomment when backend is ready - GET /dashboard/me
    // const response =
    //   await api.get<ApiResponse<DashboardResponse>>("/dashboard/me");
    // return response.data.data;

    // TEMPORARY: Return mock data based on user role from Redux store
    await delay();
    const state = store.getState();
    const userRole = state.auth.user?.role;

    switch (userRole) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return mockAdminDashboard;
      case "SALES":
        return mockSalesDashboard;
      case "INSPECTOR":
        return mockInspectorDashboard;
      case "FINANCE":
        return mockFinanceDashboard;
      case "STORE_MANAGER":
        return mockStoreManagerDashboard;
      default:
        return mockAdminDashboard;
    }
  },

  // Role-specific dashboard endpoints
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    // TODO: Uncomment when backend is ready - GET /dashboard/admin
    // const response =
    //   await api.get<ApiResponse<AdminDashboardResponse>>("/dashboard/admin");
    // return response.data.data;

    // TEMPORARY: Return mock data
    await delay();
    return mockAdminDashboard;
  },

  getSalesDashboard: async (): Promise<SalesDashboardResponse> => {
    // TODO: Uncomment when backend is ready - GET /dashboard/sales
    // const response =
    //   await api.get<ApiResponse<SalesDashboardResponse>>("/dashboard/sales");
    // return response.data.data;

    // TEMPORARY: Return mock data
    await delay();
    return mockSalesDashboard;
  },

  getInspectorDashboard: async (): Promise<InspectorDashboardResponse> => {
    // TODO: Uncomment when backend is ready - GET /dashboard/inspector
    // const response = await api.get<ApiResponse<InspectorDashboardResponse>>(
    //   "/dashboard/inspector"
    // );
    // return response.data.data;

    // TEMPORARY: Return mock data
    await delay();
    return mockInspectorDashboard;
  },

  getFinanceDashboard: async (): Promise<FinanceDashboardResponse> => {
    // TODO: Uncomment when backend is ready - GET /dashboard/finance
    // const response =
    //   await api.get<ApiResponse<FinanceDashboardResponse>>(
    //     "/dashboard/finance"
    //   );
    // return response.data.data;

    // TEMPORARY: Return mock data
    await delay();
    return mockFinanceDashboard;
  },

  getStoreManagerDashboard:
    async (): Promise<StoreManagerDashboardResponse> => {
      // TODO: Uncomment when backend is ready - GET /dashboard/store-manager
      // const response = await api.get<
      //   ApiResponse<StoreManagerDashboardResponse>
      // >("/dashboard/store-manager");
      // return response.data.data;

      // TEMPORARY: Return mock data
      await delay();
      return mockStoreManagerDashboard;
    },
};
