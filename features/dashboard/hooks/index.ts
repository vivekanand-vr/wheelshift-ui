import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries";
import type { DashboardRole } from "../types";

/**
 * Hook to fetch dashboard data based on user role
 * @param role - Optional role to fetch specific dashboard, if not provided uses current user's role
 * @returns React Query result with dashboard data
 */
export const useDashboard = (role?: DashboardRole) => {
  return useQuery(dashboardQueries.byRole(role));
};

/**
 * Hook to fetch current user's dashboard (auto-detects role)
 * @returns React Query result with dashboard data
 */
export const useCurrentDashboard = () => {
  return useQuery(dashboardQueries.current());
};

/**
 * Hook to fetch admin dashboard
 * @returns React Query result with admin dashboard data
 */
export const useAdminDashboard = () => {
  return useQuery(dashboardQueries.admin());
};

/**
 * Hook to fetch sales dashboard
 * @returns React Query result with sales dashboard data
 */
export const useSalesDashboard = () => {
  return useQuery(dashboardQueries.sales());
};

/**
 * Hook to fetch inspector dashboard
 * @returns React Query result with inspector dashboard data
 */
export const useInspectorDashboard = () => {
  return useQuery(dashboardQueries.inspector());
};

/**
 * Hook to fetch finance dashboard
 * @returns React Query result with finance dashboard data
 */
export const useFinanceDashboard = () => {
  return useQuery(dashboardQueries.finance());
};

/**
 * Hook to fetch store manager dashboard
 * @returns React Query result with store manager dashboard data
 */
export const useStoreManagerDashboard = () => {
  return useQuery(dashboardQueries.storeManager());
};
