import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: dashboardService.getRecentActivity,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useChartData = (period: "week" | "month" | "year" = "week") => {
  return useQuery({
    queryKey: ["dashboard", "chart", period],
    queryFn: () => dashboardService.getChartData(period),
    staleTime: 5 * 60 * 1000,
  });
};
