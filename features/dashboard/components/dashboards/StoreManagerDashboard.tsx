"use client";

import {
  MapPin,
  Package,
  TrendingUp,
  AlertTriangle,
  Wrench,
  ArrowRightLeft,
} from "lucide-react";
import { StoreManagerDashboardResponse } from "../../types";
import { StatCard } from "../widgets/StatCard";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WidgetEmpty } from "../widgets/WidgetEmpty";

interface StoreManagerDashboardProps {
  data: StoreManagerDashboardResponse;
}

export const StoreManagerDashboard = ({ data }: StoreManagerDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Location Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Locations"
          value={data.locationOverview.totalLocations}
          description="Managed locations"
          icon={MapPin}
        />
        <StatCard
          title="Total Capacity"
          value={data.locationOverview.totalCapacity}
          description="Available spaces"
          icon={Package}
        />
        <StatCard
          title="Current Occupancy"
          value={data.locationOverview.currentOccupancy}
          description="Vehicles stored"
          icon={Package}
          iconClassName="bg-blue-500/10"
        />
        <StatCard
          title="Utilization Rate"
          value={`${data.locationOverview.utilizationRate.toFixed(1)}%`}
          description="Capacity usage"
          icon={TrendingUp}
          iconClassName="bg-green-500/10"
        />
      </div>

      {/* Capacity Overview */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Package className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Capacity Overview</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {data.locationOverview.currentOccupancy} /{" "}
                {data.locationOverview.totalCapacity} Spaces
              </span>
              <Badge
                variant={
                  data.locationOverview.utilizationRate >= 90
                    ? "destructive"
                    : data.locationOverview.utilizationRate >= 70
                      ? "secondary"
                      : "default"
                }
              >
                {data.locationOverview.utilizationRate >= 90
                  ? "Nearly Full"
                  : data.locationOverview.utilizationRate >= 70
                    ? "High Usage"
                    : "Good"}
              </Badge>
            </div>
            <Progress
              value={data.locationOverview.utilizationRate}
              className="h-3"
            />
            <p className="text-muted-foreground mt-2 text-center text-xs">
              {data.locationOverview.totalCapacity -
                data.locationOverview.currentOccupancy}{" "}
              spaces available
            </p>
          </div>
        </div>
      </Card>

      {/* Vehicle Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* By Location */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Vehicles by Location</h3>
          </div>
          {Object.keys(data.vehicleDistribution.byLocation).length === 0 ? (
            <WidgetEmpty
              title="No Distribution Data"
              message="Vehicle distribution data will appear here."
            />
          ) : (
            <div className="space-y-3">
              {Object.entries(data.vehicleDistribution.byLocation).map(
                ([location, count]) => (
                  <div key={location} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{location}</span>
                      <Badge variant="secondary">{count} vehicles</Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Card>

        {/* By Status */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Vehicles by Status</h3>
          </div>
          {Object.keys(data.vehicleDistribution.byStatus).length === 0 ? (
            <WidgetEmpty
              title="No Status Data"
              message="Vehicle status data will appear here."
            />
          ) : (
            <div className="space-y-3">
              {Object.entries(data.vehicleDistribution.byStatus).map(
                ([status, count]) => (
                  <div key={status} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {status.replace("_", " ").toLowerCase()}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Movement Activity */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ArrowRightLeft className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Movement Activity</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Today&apos;s Movements
            </p>
            <p className="text-primary text-3xl font-bold">
              {data.movements.todayMovements}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              This Week&apos;s Movements
            </p>
            <p className="text-3xl font-bold">
              {data.movements.thisWeekMovements}
            </p>
          </div>
        </div>
      </Card>

      {/* Capacity Alerts */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-warning h-5 w-5" />
          <h3 className="text-lg font-semibold">Capacity Alerts</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.capacityAlerts.nearFullLocations > 0 && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Near Full Locations
              </p>
              <p className="text-destructive text-3xl font-bold">
                {data.capacityAlerts.nearFullLocations}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                &gt;85% capacity
              </p>
            </div>
          )}
          {data.capacityAlerts.underutilizedLocations > 0 && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Underutilized Locations
              </p>
              <p className="text-warning text-3xl font-bold">
                {data.capacityAlerts.underutilizedLocations}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                &lt;30% capacity
              </p>
            </div>
          )}
        </div>
        {data.capacityAlerts.details.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.capacityAlerts.details.map((alert: any, index: number) => (
              <div key={index} className="bg-background rounded-lg border p-3">
                <p className="text-sm">{alert.message || alert.locationName}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Maintenance and Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Maintenance Status */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Wrench className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Maintenance Status</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Vehicles in Maintenance
              </p>
              <p className="text-3xl font-bold">
                {data.maintenanceStatus.vehiclesInMaintenance}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Avg Maintenance Time
              </p>
              <p className="text-3xl font-bold">
                {data.maintenanceStatus.avgMaintenanceTime.toFixed(0)} days
              </p>
            </div>
            {data.maintenanceStatus.upcomingMaintenance > 0 && (
              <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-sm">
                  Upcoming Maintenance
                </p>
                <p className="text-warning text-3xl font-bold">
                  {data.maintenanceStatus.upcomingMaintenance}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Location Performance */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Avg Turnover Days
              </p>
              <p className="text-3xl font-bold">
                {data.performance.avgTurnoverDays.toFixed(0)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Days to sell</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-sm">
                Avg Stay Duration
              </p>
              <p className="text-3xl font-bold">
                {data.performance.avgStayDuration.toFixed(0)} days
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Time in location
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
