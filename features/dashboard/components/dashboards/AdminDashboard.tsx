"use client";

import {
  Car,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AdminDashboardResponse } from "../../types";
import { RevenueChartWidget } from "../widgets/RevenueChartWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { AlertsWidget } from "../widgets/AlertsWidget";
import { StatsGroupWidget } from "../widgets/StatsGroupWidget";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminDashboardProps {
  data: AdminDashboardResponse;
}

export const AdminDashboard = ({ data }: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Stats Groups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsGroupWidget
          title="Inventory Overview"
          icon={Car}
          stats={[
            { label: "Total Cars", value: data.overview.totalCars, icon: Car },
            {
              label: "Available",
              value: data.overview.availableCars,
              icon: Package,
            },
            {
              label: "Reserved",
              value: data.overview.reservedCars,
              icon: AlertTriangle,
            },
            {
              label: "Sold This Month",
              value: data.overview.soldCarsThisMonth,
              icon: ShoppingCart,
            },
          ]}
        />

        <StatsGroupWidget
          title="Revenue Metrics"
          icon={DollarSign}
          stats={[
            {
              label: "Total Revenue",
              value: `$${data.revenue.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Monthly Revenue",
              value: `$${data.revenue.monthlyRevenue.toLocaleString()}`,
              icon: TrendingUp,
            },
            {
              label: "YTD Revenue",
              value: `$${data.revenue.ytdRevenue.toLocaleString()}`,
              icon: TrendingUp,
            },
            {
              label: "Avg Sale Price",
              value: `$${data.revenue.averageSalePrice.toLocaleString()}`,
              icon: DollarSign,
            },
          ]}
        />

        <StatsGroupWidget
          title="Activity Overview"
          icon={Clock}
          stats={[
            {
              label: "Active Inquiries",
              value: data.overview.activeInquiries,
              icon: Clock,
            },
            {
              label: "Active Reservations",
              value: data.overview.activeReservations,
              icon: AlertTriangle,
            },
            {
              label: "Total Employees",
              value: data.overview.totalEmployees,
              icon: Users,
            },
            {
              label: "Active Employees",
              value: data.overview.activeEmployees,
              icon: Users,
            },
          ]}
        />
      </div>

      {/* Middle Row - Charts and Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChartWidget data={data.revenue} />

        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Inventory by Status</h3>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {Object.entries(data.inventory.byStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                  >
                    <span className="text-sm font-medium capitalize">
                      {status.toLowerCase().replace(/_/g, " ")}
                    </span>
                    <span className="text-base font-bold">{count}</span>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Bottom Row - Activities and Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Top Performers</h3>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {data.topEmployees.slice(0, 5).map((employee) => (
                <div
                  key={employee.employeeId}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {employee.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">
                        {employee.employeeName}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {employee.salesCount} sales
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold">
                    ${employee.totalRevenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <AlertsWidget data={data.alerts} />
        <NotificationsWidget data={data.notifications} />
      </div>
    </div>
  );
};
