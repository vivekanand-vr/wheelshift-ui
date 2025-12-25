// Dashboard Type Definitions

export interface OverviewStats {
  totalCars: number;
  availableCars: number;
  reservedCars: number;
  soldCarsThisMonth: number;
  activeInquiries: number;
  activeReservations: number;
  totalEmployees: number;
  activeEmployees: number;
}

export interface MonthlyRevenue {
  month: number;
  monthName: string;
  revenue: number;
  salesCount: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  ytdRevenue: number;
  averageSalePrice: number;
  revenueTrend: MonthlyRevenue[];
}

export interface AgingInventoryItem {
  carId: number;
  make: string;
  model: string;
  year: number;
  daysInInventory: number;
  purchasePrice: number;
}

export interface InventoryHealth {
  byStatus: Record<string, number>;
  totalValue: number;
  avgAge: number;
  agingInventory: AgingInventoryItem[];
}

export interface ActivityLog {
  id: number;
  type: string;
  description: string;
  entityType: string;
  entityId: number;
  timestamp: string;
  performedBy: string;
}

export interface EmployeePerformance {
  employeeId: number;
  employeeName: string;
  position: string;
  salesCount: number;
  totalCommission: number;
  totalRevenue: number;
}

export interface AlertDetail {
  type: string;
  message: string;
  severity: "INFO" | "WARNING" | "ERROR";
  entityId?: number;
}

export interface SystemAlerts {
  expiringReservations: number;
  inspectionsDue: number;
  locationCapacityWarnings: number;
  details: AlertDetail[];
}

export interface NotificationItem {
  id: number;
  type: string;
  subject: string;
  body: string;
  entityType: string;
  entityId: number;
  severity: "INFO" | "WARNING" | "ERROR";
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsData {
  unreadCount: number;
  recent: NotificationItem[];
}

export interface AdminDashboardResponse {
  overview: OverviewStats;
  revenue: RevenueMetrics;
  inventory: InventoryHealth;
  recentActivities: ActivityLog[];
  topEmployees: EmployeePerformance[];
  alerts: SystemAlerts;
  notifications: NotificationsData;
}

// Sales Dashboard Types
export interface PersonalStats {
  activeInquiries: number;
  convertedInquiries: number;
  activeReservations: number;
  salesThisMonth: number;
  commissionEarned: number;
  conversionRate: number;
}

export interface SalesPipeline {
  inquiriesByStatus: Record<string, number>;
  followUpToday: number;
  followUpThisWeek: number;
}

export interface PerformanceMetrics {
  monthlySales: number;
  monthlyTarget: number;
  targetProgress: number;
  avgSaleValue: number;
}

export interface ActionItem {
  id: number;
  type: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
}

export interface QuickActions {
  pendingResponses: number;
  followUpsDue: number;
  expiringReservations: number;
  items: ActionItem[];
}

export interface InventorySummary {
  totalAvailable: number;
  newArrivals: number;
  featured: any[];
}

export interface SalesDashboardResponse {
  personalStats: PersonalStats;
  pipeline: SalesPipeline;
  performance: PerformanceMetrics;
  quickActions: QuickActions;
  availableInventory: InventorySummary;
  notifications: NotificationsData;
}

// Inspector Dashboard Types
export interface InspectionQueue {
  pendingInspections: number;
  scheduledToday: number;
  scheduledThisWeek: number;
  overdue: number;
}

export interface InspectorPersonalStats {
  completedThisMonth: number;
  passRate: number;
  avgInspectionTime: number;
  avgRepairCost: number;
}

export interface VehicleStatus {
  needingInspection: number;
  failedInspections: number;
  inMaintenance: number;
}

export interface AssignedTasks {
  total: number;
  highPriority: number;
  dueToday: number;
}

export interface LocationInspectionSummary {
  locationName: string;
  pendingCount: number;
  completedThisWeek: number;
}

export interface RecentInspection {
  id: number;
  carId: number;
  carDetails: string;
  status: string;
  completedAt: string;
  findings: string;
}

export interface InspectorDashboardResponse {
  inspectionQueue: InspectionQueue;
  personalStats: InspectorPersonalStats;
  vehicleStatus: VehicleStatus;
  assignedTasks: AssignedTasks;
  locationSummary: LocationInspectionSummary[];
  recentInspections: RecentInspection[];
  notifications: NotificationsData;
}

// Finance Dashboard Types
export interface FinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
}

export interface TransactionSummary {
  pendingCount: number;
  completedThisMonth: number;
  totalAmount: number;
  recentTransactions: any[];
}

export interface ProfitabilityMetrics {
  avgProfitPerVehicle: number;
  avgMargin: number;
  vehicleProfitability: any[];
}

export interface AgingAnalysis {
  overduePayments: number;
  overdueAmount: number;
  pendingDeposits: number;
}

export interface BudgetTracking {
  totalBudget: number;
  spent: number;
  utilizationRate: number;
  categories: Record<string, number>;
}

export interface FinanceDashboardResponse {
  financialOverview: FinancialOverview;
  transactions: TransactionSummary;
  profitability: ProfitabilityMetrics;
  aging: AgingAnalysis;
  budgetTracking: BudgetTracking;
  notifications: NotificationsData;
}

// Store Manager Dashboard Types
export interface LocationOverview {
  totalLocations: number;
  totalCapacity: number;
  currentOccupancy: number;
  utilizationRate: number;
}

export interface VehicleDistribution {
  byLocation: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface MovementActivity {
  todayMovements: number;
  thisWeekMovements: number;
  recentMovements: any[];
}

export interface CapacityAlerts {
  nearFullLocations: number;
  underutilizedLocations: number;
  details: any[];
}

export interface MaintenanceStatus {
  vehiclesInMaintenance: number;
  avgMaintenanceTime: number;
  upcomingMaintenance: number;
}

export interface LocationPerformance {
  avgTurnoverDays: number;
  avgStayDuration: number;
  topPerformingLocations: any[];
}

export interface StoreManagerDashboardResponse {
  locationOverview: LocationOverview;
  vehicleDistribution: VehicleDistribution;
  movements: MovementActivity;
  capacityAlerts: CapacityAlerts;
  maintenanceStatus: MaintenanceStatus;
  performance: LocationPerformance;
  notifications: NotificationsData;
}

export type DashboardResponse =
  | AdminDashboardResponse
  | SalesDashboardResponse
  | InspectorDashboardResponse
  | FinanceDashboardResponse
  | StoreManagerDashboardResponse;

export type DashboardRole =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "SALES"
  | "INSPECTOR"
  | "FINANCE"
  | "STORE_MANAGER";

// Recent Activity Type
export interface RecentActivity {
  id: string;
  type: "order" | "customer" | "product";
  title: string;
  timestamp: string;
  description?: string;
}
