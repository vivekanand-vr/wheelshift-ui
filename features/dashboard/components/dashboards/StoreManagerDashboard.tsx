"use client";

import {
  MapPin,
  Package,
  TrendingUp,
  AlertTriangle,
  Wrench,
  ArrowRightLeft,
  Clock,
} from "lucide-react";
import { StoreManagerDashboardResponse } from "../../types";
import { StatsGroupWidget } from "../widgets/StatsGroupWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";

interface StoreManagerDashboardProps {
  data: StoreManagerDashboardResponse;
}

export const StoreManagerDashboard = ({ data }: StoreManagerDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Stats Groups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsGroupWidget
          title="Location Overview"
          icon={MapPin}
          stats={[
            {
              label: "Total Locations",
              value: data.locationOverview.totalLocations,
              icon: MapPin,
            },
            {
              label: "Total Capacity",
              value: data.locationOverview.totalCapacity,
              icon: Package,
            },
            {
              label: "Current Occupancy",
              value: data.locationOverview.currentOccupancy,
              icon: Package,
            },
            {
              label: "Utilization Rate",
              value: `${data.locationOverview.utilizationRate.toFixed(1)}%`,
              icon: TrendingUp,
            },
          ]}
        />

        <StatsGroupWidget
          title="Movement Activity"
          icon={ArrowRightLeft}
          stats={[
            {
              label: "Movements Today",
              value: data.movements.todayMovements,
              icon: ArrowRightLeft,
            },
            {
              label: "Movements This Week",
              value: data.movements.thisWeekMovements,
              icon: ArrowRightLeft,
            },
            {
              label: "Avg Turnover",
              value: `${data.performance.avgTurnoverDays} days`,
              icon: Clock,
            },
            {
              label: "Avg Stay Duration",
              value: `${data.performance.avgStayDuration} days`,
              icon: Clock,
            },
          ]}
        />

        <StatsGroupWidget
          title="Maintenance & Alerts"
          icon={Wrench}
          stats={[
            {
              label: "In Maintenance",
              value: data.maintenanceStatus.vehiclesInMaintenance,
              icon: Wrench,
            },
            {
              label: "Upcoming Maintenance",
              value: data.maintenanceStatus.upcomingMaintenance,
              icon: Clock,
            },
            {
              label: "Near Full Locations",
              value: data.capacityAlerts.nearFullLocations,
              icon: AlertTriangle,
            },
            {
              label: "Underutilized",
              value: data.capacityAlerts.underutilizedLocations,
              icon: AlertTriangle,
            },
          ]}
        />
      </div>

      {/* Middle Row - Capacity and Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-primary h-5 w-5" />
              <Typography variant="large">Capacity Overview</Typography>
            </div>
            <Badge
              variant={
                data.locationOverview.utilizationRate >= 90
                  ? "destructive"
                  : data.locationOverview.utilizationRate >= 70
                    ? "outline"
                    : "default"
              }
            >
              {data.locationOverview.utilizationRate >= 90
                ? "Nearly Full"
                : data.locationOverview.utilizationRate >= 70
                  ? "Good"
                  : "Available"}
            </Badge>
          </div>
          <div className="space-y-4">
            <Progress value={data.locationOverview.utilizationRate} />
            <Typography variant="muted" className="text-xs">
              {data.locationOverview.currentOccupancy} /{" "}
              {data.locationOverview.totalCapacity} spaces occupied
            </Typography>
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {data.capacityAlerts.details.map(
                  (alert: any, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${
                        alert.status === "NEAR_FULL"
                          ? "bg-destructive/10 border-destructive/20"
                          : "bg-warning/10 border-warning/20"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {alert.location}
                        </span>
                        <Badge
                          variant={
                            alert.status === "NEAR_FULL"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {alert.utilizationRate.toFixed(0)}%
                        </Badge>
                      </div>
                      <Typography variant="muted" className="text-[10px]">
                        {alert.occupancy} / {alert.capacity} spaces
                      </Typography>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <Typography variant="large">Vehicle Distribution</Typography>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-4 pr-4">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-xs font-semibold"
                >
                  By Location
                </Typography>
                <div className="space-y-2">
                  {Object.entries(data.vehicleDistribution.byLocation).map(
                    ([location, count]) => (
                      <div
                        key={location}
                        className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                      >
                        <span className="text-xs font-medium">{location}</span>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-xs font-semibold"
                >
                  By Status
                </Typography>
                <div className="space-y-2">
                  {Object.entries(data.vehicleDistribution.byStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                      >
                        <span className="text-xs font-medium capitalize">
                          {status.toLowerCase().replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Bottom Row - Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
