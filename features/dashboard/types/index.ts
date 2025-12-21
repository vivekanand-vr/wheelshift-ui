export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  growthRate: number;
}

export interface RecentActivity {
  id: string;
  type: "order" | "customer" | "product";
  title: string;
  description: string;
  timestamp: string;
}

export interface ChartData {
  label: string;
  value: number;
}
