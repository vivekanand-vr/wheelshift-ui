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
import { StatCard } from "../widgets/StatCard";
import { RevenueChartWidget } from "../widgets/RevenueChartWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { RecentActivitiesWidget } from "../widgets/RecentActivitiesWidget";
import { AlertsWidget } from "../widgets/AlertsWidget";
import { Card } from "@/components/ui/card";
import { WidgetEmpty } from "../widgets/WidgetEmpty";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminDashboardProps {
  data: AdminDashboardResponse;
}

export const AdminDashboard = ({ data }: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Cars"
          value={data.overview.totalCars}
          description={`${data.overview.availableCars} available`}
          icon={Car}
        />
        <StatCard
          title="Available Cars"
          value={data.overview.availableCars}
          description={`${data.overview.reservedCars} reserved`}
          icon={Package}
        />
        <StatCard
          title="Sales This Month"
          value={data.overview.soldCarsThisMonth}
          description="Monthly sales"
          icon={ShoppingCart}
        />
        <StatCard
          title="Active Employees"
          value={data.overview.activeEmployees}
          description={`${data.overview.totalEmployees} total`}
          icon={Users}
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${data.revenue.totalRevenue.toLocaleString()}`}
          description="All time"
          icon={DollarSign}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${data.revenue.monthlyRevenue.toLocaleString()}`}
          description="This month"
          icon={TrendingUp}
          iconClassName="bg-blue-500/10"
        />
        <StatCard
          title="YTD Revenue"
          value={`$${data.revenue.ytdRevenue.toLocaleString()}`}
          description="Year to date"
          icon={DollarSign}
          iconClassName="bg-purple-500/10"
        />
        <StatCard
          title="Average Sale"
          value={`$${data.revenue.averageSalePrice.toLocaleString()}`}
          description="Per vehicle"
          icon={TrendingUp}
          iconClassName="bg-orange-500/10"
        />
      </div>

      {/* Inquiries and Reservations */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Active Inquiries"
          value={data.overview.activeInquiries}
          description="Pending responses"
          icon={Clock}
        />
        <StatCard
          title="Active Reservations"
          value={data.overview.activeReservations}
          description="Reserved vehicles"
          icon={AlertTriangle}
        />
        <StatCard
          title="Inventory Value"
          value={`$${data.inventory.totalValue.toLocaleString()}`}
          description={`Avg age: ${data.inventory.avgAge.toFixed(0)} days`}
          icon={Package}
        />
      </div>

      {/* Charts and Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChartWidget data={data.revenue} />

        {/* Inventory Health */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Inventory by Status</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data.inventory.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {status.toLowerCase()}
                </span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Employees */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Top Performers</h3>
        </div>
        {data.topEmployees.length === 0 ? (
          <WidgetEmpty
            title="No Performance Data"
            message="Employee performance data will appear once sales are recorded."
          />
        ) : (
          <div className="space-y-3">
            {data.topEmployees.map((employee, index) => (
              <div
                key={employee.employeeId}
                id={`employee-${index}`}
                className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {employee.employeeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {employee.employeeName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {employee.position}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {employee.salesCount} sales
                  </p>
                  <p className="text-muted-foreground text-xs">
                    ${employee.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Alerts and Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <AlertsWidget data={data.alerts} />
        <RecentActivitiesWidget activities={data.recentActivities} />
      </div>

      {/* Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
