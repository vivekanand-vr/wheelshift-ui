"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../api/queries";
import type { DashboardRole } from "../types";

/**
 * Main Dashboard Hook - Comprehensive dashboard data management
 * Pattern: Component → useDashboard hook → Queries → Services (API)
 *
 * This hook handles:
 * - Dashboard data fetching (auto-detects role from Redux)
 * - Role-specific dashboard queries
 * - Auto-refresh and caching via React Query
 *
 * Usage in components:
 * const { data, isLoading, error, refetch } = useDashboard();
 */
export const useDashboard = (role?: DashboardRole) => {
  return useQuery(dashboardQueries.byRole(role));
};

/**
 * Get current user's dashboard (auto-detects role)
 * Most common use case - fetches dashboard based on logged-in user's role
 */
export const useCurrentDashboard = () => {
  return useQuery(dashboardQueries.current());
};

/**
 * Get admin dashboard
 * Used for: Admin/Super Admin specific dashboard views
 */
export const useAdminDashboard = () => {
  return useQuery(dashboardQueries.admin());
};

/**
 * Get sales dashboard
 * Used for: Sales team dashboard
 */
export const useSalesDashboard = () => {
  return useQuery(dashboardQueries.sales());
};

/**
 * Get inspector dashboard
 * Used for: Inspector team dashboard
 */
export const useInspectorDashboard = () => {
  return useQuery(dashboardQueries.inspector());
};

/**
 * Get finance dashboard
 * Used for: Finance team dashboard
 */
export const useFinanceDashboard = () => {
  return useQuery(dashboardQueries.finance());
};

/**
 * Get store manager dashboard
 * Used for: Store management dashboard
 */
export const useStoreManagerDashboard = () => {
  return useQuery(dashboardQueries.storeManager());
};
