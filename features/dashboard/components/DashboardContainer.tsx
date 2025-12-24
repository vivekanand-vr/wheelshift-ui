"use client";

import { useDashboard } from "../hooks";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { SalesDashboard } from "./dashboards/SalesDashboard";
import { InspectorDashboard } from "./dashboards/InspectorDashboard";
import { FinanceDashboard } from "./dashboards/FinanceDashboard";
import { StoreManagerDashboard } from "./dashboards/StoreManagerDashboard";
import {
  StatCardSkeleton,
  ChartSkeleton,
  ListSkeleton,
} from "./widgets/WidgetSkeleton";
import { WidgetError } from "./widgets/WidgetError";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { DashboardRole } from "../types";

interface DashboardContainerProps {
  userRole?: DashboardRole;
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <ChartSkeleton />
      <ListSkeleton />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <ListSkeleton />
      <ListSkeleton />
    </div>
  </div>
);

export const DashboardContainer = ({ userRole }: DashboardContainerProps) => {
  const { data, isLoading, error, refetch } = useDashboard(userRole);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <WidgetError
        title="Failed to Load Dashboard"
        message={
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data. Please try again."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Dashboard Data</h3>
          <p className="text-muted-foreground text-sm">
            Unable to load dashboard. Please contact support if this issue
            persists.
          </p>
        </div>
      </Card>
    );
  }

  // Detect dashboard type from data structure
  const dashboardType = detectDashboardType(data);

  switch (dashboardType) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return <AdminDashboard data={data as any} />;
    case "SALES":
      return <SalesDashboard data={data as any} />;
    case "INSPECTOR":
      return <InspectorDashboard data={data as any} />;
    case "FINANCE":
      return <FinanceDashboard data={data as any} />;
    case "STORE_MANAGER":
      return <StoreManagerDashboard data={data as any} />;
    default:
      return (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              Unknown Dashboard Type
            </h3>
            <p className="text-muted-foreground text-sm">
              Unable to determine the appropriate dashboard for your role.
            </p>
          </div>
        </Card>
      );
  }
};

// Helper function to detect dashboard type from response structure
function detectDashboardType(data: any): DashboardRole | null {
  if ("overview" in data && "revenue" in data && "inventory" in data) {
    return "ADMIN";
  }
  if ("personalStats" in data && "pipeline" in data && "performance" in data) {
    return "SALES";
  }
  if (
    "inspectionQueue" in data &&
    "vehicleStatus" in data &&
    "assignedTasks" in data
  ) {
    return "INSPECTOR";
  }
  if (
    "financialOverview" in data &&
    "transactions" in data &&
    "profitability" in data
  ) {
    return "FINANCE";
  }
  if (
    "locationOverview" in data &&
    "vehicleDistribution" in data &&
    "movements" in data
  ) {
    return "STORE_MANAGER";
  }
  return null;
}
