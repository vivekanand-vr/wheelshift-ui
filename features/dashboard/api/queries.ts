import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "./services";
import type { DashboardRole } from "../types";

/**
 * Dashboard Queries - React Query configurations for data fetching
 * Pattern: Hooks → Queries → Services (API)
 */
export const dashboardQueries = {
  /**
   * Get current user's dashboard (auto-detects role from Redux)
   * Used for: Main dashboard page
   */
  current: () =>
    queryOptions({
      queryKey: ["dashboard", "current"],
      queryFn: () => dashboardApi.getCurrentUserDashboard(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    }),

  /**
   * Get admin dashboard
   */
  admin: () =>
    queryOptions({
      queryKey: ["dashboard", "admin"],
      queryFn: () => dashboardApi.getAdminDashboard(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  /**
   * Get sales dashboard
   */
  sales: () =>
    queryOptions({
      queryKey: ["dashboard", "sales"],
      queryFn: () => dashboardApi.getSalesDashboard(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  /**
   * Get inspector dashboard
   */
  inspector: () =>
    queryOptions({
      queryKey: ["dashboard", "inspector"],
      queryFn: () => dashboardApi.getInspectorDashboard(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  /**
   * Get finance dashboard
   */
  finance: () =>
    queryOptions({
      queryKey: ["dashboard", "finance"],
      queryFn: () => dashboardApi.getFinanceDashboard(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  /**
   * Get store manager dashboard
   */
  storeManager: () =>
    queryOptions({
      queryKey: ["dashboard", "store-manager"],
      queryFn: () => dashboardApi.getStoreManagerDashboard(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  /**
   * Get dashboard by role (dynamic)
   * @param role - Optional role to fetch specific dashboard
   */
  byRole: (role?: DashboardRole) =>
    queryOptions({
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
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),
};
