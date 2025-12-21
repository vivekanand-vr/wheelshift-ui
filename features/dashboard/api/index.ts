import axios from "@/lib/api/axios";
import type { DashboardStats, RecentActivity, ChartData } from "../types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get("/dashboard/stats");
    return response.data;
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const response = await axios.get("/dashboard/activity");
    return response.data;
  },

  getChartData: async (
    period: "week" | "month" | "year"
  ): Promise<ChartData[]> => {
    const response = await axios.get(`/dashboard/chart?period=${period}`);
    return response.data;
  },
};
