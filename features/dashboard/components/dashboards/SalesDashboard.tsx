"use client";

import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Target,
} from "lucide-react";
import { SalesDashboardResponse } from "../../types";
import { StatCard } from "../widgets/StatCard";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SalesDashboardProps {
  data: SalesDashboardResponse;
}

export const SalesDashboard = ({ data }: SalesDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Inquiries"
          value={data.personalStats.activeInquiries}
          description={`${data.personalStats.convertedInquiries} converted`}
          icon={Users}
        />
        <StatCard
          title="Sales This Month"
          value={data.personalStats.salesThisMonth}
          description="Monthly performance"
          icon={CheckCircle}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Commission Earned"
          value={`$${data.personalStats.commissionEarned.toLocaleString()}`}
          description="This month"
          icon={DollarSign}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Conversion Rate"
          value={`${data.personalStats.conversionRate.toFixed(1)}%`}
          description="Success rate"
          icon={TrendingUp}
          iconClassName="bg-blue-500/10"
        />
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Target className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Monthly Target Progress</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {data.performance.monthlySales} /{" "}
                {data.performance.monthlyTarget} Sales
              </p>
              <p className="text-muted-foreground text-xs">
                {data.performance.targetProgress.toFixed(1)}% of target
              </p>
            </div>
            <Badge
              variant={
                data.performance.targetProgress >= 100 ? "default" : "secondary"
              }
            >
              {data.performance.targetProgress >= 100
                ? "Target Met"
                : "In Progress"}
            </Badge>
          </div>
          <Progress value={data.performance.targetProgress} className="h-2" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-muted-foreground text-xs">
                Average Sale Value
              </p>
              <p className="text-lg font-semibold">
                ${data.performance.avgSaleValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Remaining</p>
              <p className="text-lg font-semibold">
                {Math.max(
                  0,
                  data.performance.monthlyTarget - data.performance.monthlySales
                )}{" "}
                sales
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Sales Pipeline */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Sales Pipeline</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-sm font-medium">
              Inquiries by Status
            </h4>
            {Object.entries(data.pipeline.inquiriesByStatus).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                >
                  <span className="text-sm font-medium capitalize">
                    {status.replace("_", " ").toLowerCase()}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              )
            )}
          </div>
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-sm font-medium">
              Follow-ups
            </h4>
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-3">
              <div className="mb-1 flex items-center gap-2">
                <Clock className="text-warning h-4 w-4" />
                <span className="text-sm font-medium">Due Today</span>
              </div>
              <p className="text-2xl font-bold">
                {data.pipeline.followUpToday}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="mb-1 flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Due This Week</span>
              </div>
              <p className="text-2xl font-bold">
                {data.pipeline.followUpThisWeek}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Pending Responses
            </p>
            <p className="text-2xl font-bold">
              {data.quickActions.pendingResponses}
            </p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Follow-ups Due</p>
            <p className="text-warning text-2xl font-bold">
              {data.quickActions.followUpsDue}
            </p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Expiring Reservations
            </p>
            <p className="text-destructive text-2xl font-bold">
              {data.quickActions.expiringReservations}
            </p>
          </div>
        </div>
        {data.quickActions.items.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.quickActions.items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="bg-background rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-muted-foreground text-xs">{item.type}</p>
                  </div>
                  <Badge
                    variant={
                      item.priority === "HIGH"
                        ? "destructive"
                        : item.priority === "MEDIUM"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Available Inventory */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Package className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Available Inventory</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Total Available
            </p>
            <p className="text-3xl font-bold">
              {data.availableInventory.totalAvailable}
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">New Arrivals</p>
            <p className="text-primary text-3xl font-bold">
              {data.availableInventory.newArrivals}
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
