"use client";

import { useDashboard } from "../hooks";
import { useAuth } from "@/features/auth";
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
import { EmptyState } from "@/components/common/EmptyState";
import { AlertCircle } from "lucide-react";
import type { DashboardRole } from "../types";

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

export const DashboardContainer = () => {
  const { user } = useAuth();
  const userRole = user?.role as DashboardRole;
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
      <EmptyState
        icon={<AlertCircle className="h-12 w-12" />}
        title="No Dashboard Data"
        description="Unable to load dashboard. Please contact support if this issue persists."
      />
    );
  }

  // Use the userRole from auth store to determine which dashboard to render
  switch (userRole) {
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
        <EmptyState
          icon={<AlertCircle className="h-12 w-12" />}
          title="Unknown Dashboard Type"
          description="Unable to determine the appropriate dashboard for your role."
        />
      );
  }
};
