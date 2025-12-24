import { dashboardApi } from "../api";
import type { DashboardRole } from "../types";

// Dashboard React Query configurations
export const dashboardQueries = {
  // Current user's dashboard (auto-detects role)
  current: () => ({
    queryKey: ["dashboard", "current"],
    queryFn: () => dashboardApi.getCurrentUserDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  }),

  // Admin dashboard
  admin: () => ({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardApi.getAdminDashboard(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),

  // Sales dashboard
  sales: () => ({
    queryKey: ["dashboard", "sales"],
    queryFn: () => dashboardApi.getSalesDashboard(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),

  // Inspector dashboard
  inspector: () => ({
    queryKey: ["dashboard", "inspector"],
    queryFn: () => dashboardApi.getInspectorDashboard(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),

  // Finance dashboard
  finance: () => ({
    queryKey: ["dashboard", "finance"],
    queryFn: () => dashboardApi.getFinanceDashboard(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),

  // Store Manager dashboard
  storeManager: () => ({
    queryKey: ["dashboard", "store-manager"],
    queryFn: () => dashboardApi.getStoreManagerDashboard(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),

  // Dynamic role-based dashboard
  byRole: (role?: DashboardRole) => ({
    queryKey: ["dashboard", role || "current"],
    queryFn: () => {
      if (!role) {
        return dashboardApi.getCurrentUserDashboard();
      }

      switch (role) {
        case "ADMIN":
        case "SUPER_ADMIN":
          return dashboardApi.getAdminDashboard();
        case "SALES":
          return dashboardApi.getSalesDashboard();
        case "INSPECTOR":
          return dashboardApi.getInspectorDashboard();
        case "FINANCE":
          return dashboardApi.getFinanceDashboard();
        case "STORE_MANAGER":
          return dashboardApi.getStoreManagerDashboard();
        default:
          return dashboardApi.getCurrentUserDashboard();
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  }),
};
