import { store } from "@/lib/redux/store";
import type {
  AdminDashboardResponse,
  SalesDashboardResponse,
  InspectorDashboardResponse,
  FinanceDashboardResponse,
  StoreManagerDashboardResponse,
  DashboardResponse,
} from "../types";
import {
  mockAdminDashboard,
  mockSalesDashboard,
  mockInspectorDashboard,
  mockFinanceDashboard,
  mockStoreManagerDashboard,
} from "../constants";

/**
 * Dashboard Services - Pure API call functions
 * Pattern: Hooks → Queries → Services (API)
 *
 * These functions should only handle HTTP requests and responses.
 * No business logic, state management, or side effects should be here.
 *
 * TODO: Uncomment API calls when backend is ready
 */

// TODO: Uncomment when backend is ready
// import { api } from "@/lib/api/axios";
// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
//   timestamp: string;
// }

/**
 * Helper to simulate API delay during development
 * Remove this when backend is ready
 */
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Dashboard API Services
 */
export const dashboardApi = {
  /**
   * Get current user's dashboard (auto-detects role from Redux)
   * @returns Dashboard data based on user's role
   */
  getCurrentUserDashboard: async (): Promise<DashboardResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get<ApiResponse<DashboardResponse>>("/dashboard/me");
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

  /**
   * Get admin dashboard
   * @returns Admin dashboard data
   */
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get<ApiResponse<AdminDashboardResponse>>("/dashboard/admin");
    // return response.data.data;

    await delay();
    return mockAdminDashboard;
  },

  /**
   * Get sales dashboard
   * @returns Sales dashboard data
   */
  getSalesDashboard: async (): Promise<SalesDashboardResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get<ApiResponse<SalesDashboardResponse>>("/dashboard/sales");
    // return response.data.data;

    await delay();
    return mockSalesDashboard;
  },

  /**
   * Get inspector dashboard
   * @returns Inspector dashboard data
   */
  getInspectorDashboard: async (): Promise<InspectorDashboardResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get<ApiResponse<InspectorDashboardResponse>>("/dashboard/inspector");
    // return response.data.data;

    await delay();
    return mockInspectorDashboard;
  },

  /**
   * Get finance dashboard
   * @returns Finance dashboard data
   */
  getFinanceDashboard: async (): Promise<FinanceDashboardResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get<ApiResponse<FinanceDashboardResponse>>("/dashboard/finance");
    // return response.data.data;

    await delay();
    return mockFinanceDashboard;
  },

  /**
   * Get store manager dashboard
   * @returns Store manager dashboard data
   */
  getStoreManagerDashboard:
    async (): Promise<StoreManagerDashboardResponse> => {
      // TODO: Uncomment when backend is ready
      // const response = await api.get<ApiResponse<StoreManagerDashboardResponse>>("/dashboard/store-manager");
      // return response.data.data;

      await delay();
      return mockStoreManagerDashboard;
    },
};
