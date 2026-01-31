"use client";

import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Target,
  Package,
  Bell,
} from "lucide-react";
import { SalesDashboardResponse } from "../../types";
import { StatsGroupWidget } from "../widgets/StatsGroupWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";

interface SalesDashboardProps {
  data: SalesDashboardResponse;
}

export const SalesDashboard = ({ data }: SalesDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Stats Groups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsGroupWidget
          title="Personal Performance"
          icon={Users}
          stats={[
            {
              label: "Active Inquiries",
              value: data.personalStats.activeInquiries,
              icon: Users,
            },
            {
              label: "Converted",
              value: data.personalStats.convertedInquiries,
              icon: CheckCircle,
            },
            {
              label: "Sales This Month",
              value: data.personalStats.salesThisMonth,
              icon: CheckCircle,
            },
            {
              label: "Conversion Rate",
              value: `${data.personalStats.conversionRate}%`,
              icon: TrendingUp,
            },
          ]}
        />

        <StatsGroupWidget
          title="Revenue & Commission"
          icon={DollarSign}
          stats={[
            {
              label: "Commission Earned",
              value: `$${data.personalStats.commissionEarned.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Monthly Target",
              value: data.performance.monthlyTarget,
              icon: Target,
            },
            {
              label: "Sales Achieved",
              value: data.performance.monthlySales,
              icon: CheckCircle,
            },
            {
              label: "Avg Sale Value",
              value: `$${data.performance.avgSaleValue.toLocaleString()}`,
              icon: TrendingUp,
            },
          ]}
        />

        <StatsGroupWidget
          title="Pipeline Activity"
          icon={Clock}
          stats={[
            {
              label: "Active Reservations",
              value: data.personalStats.activeReservations,
              icon: Package,
            },
            {
              label: "Follow-ups Today",
              value: data.pipeline.followUpToday,
              icon: Clock,
            },
            {
              label: "Follow-ups This Week",
              value: data.pipeline.followUpThisWeek,
              icon: Clock,
            },
            {
              label: "Pending Responses",
              value: data.quickActions.pendingResponses,
              icon: Bell,
            },
          ]}
        />
      </div>

      {/* Middle Row - Target Progress and Pipeline */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="text-primary h-5 w-5" />
            <Typography variant="large">Monthly Target Progress</Typography>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {data.performance.monthlySales} /{" "}
                {data.performance.monthlyTarget} Sales
              </span>
              <Badge variant="default">
                {data.performance.targetProgress}%
              </Badge>
            </div>
            <Progress value={data.performance.targetProgress} />
            <Typography variant="muted" className="text-xs">
              {data.performance.monthlyTarget - data.performance.monthlySales}{" "}
              sales remaining to hit target
            </Typography>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <Typography variant="large">Sales Pipeline</Typography>
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {Object.entries(data.pipeline.inquiriesByStatus).map(
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

      {/* Bottom Row - Quick Actions and Notifications */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" />
            <Typography variant="large">Quick Actions</Typography>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {data.quickActions.items.map((action) => (
                <div
                  key={action.id}
                  className={`rounded-lg border p-3 ${
                    action.priority === "HIGH"
                      ? "bg-destructive/10 border-destructive/20"
                      : action.priority === "MEDIUM"
                        ? "bg-warning/10 border-warning/20"
                        : "bg-muted/30"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <Badge
                      variant={
                        action.priority === "HIGH"
                          ? "destructive"
                          : action.priority === "MEDIUM"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {action.priority}
                    </Badge>
                  </div>
                  <Typography variant="small" className="text-xs">
                    {action.description}
                  </Typography>
                  {action.dueDate && (
                    <Typography variant="muted" className="mt-1 text-[10px]">
                      Due: {new Date(action.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <NotificationsWidget data={data.notifications} />
      </div>
    </div>
  );
};
