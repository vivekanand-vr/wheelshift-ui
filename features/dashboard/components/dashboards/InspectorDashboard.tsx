"use client";

import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Wrench,
} from "lucide-react";
import { InspectorDashboardResponse } from "../../types";
import { StatCard } from "../widgets/StatCard";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetEmpty } from "../widgets/WidgetEmpty";
import { formatDistanceToNow } from "date-fns";

interface InspectorDashboardProps {
  data: InspectorDashboardResponse;
}

export const InspectorDashboard = ({ data }: InspectorDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Inspection Queue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Inspections"
          value={data.inspectionQueue.pendingInspections}
          description="Awaiting inspection"
          icon={ClipboardCheck}
        />
        <StatCard
          title="Scheduled Today"
          value={data.inspectionQueue.scheduledToday}
          description="Today's workload"
          icon={Clock}
          iconClassName="bg-blue-500/10"
        />
        <StatCard
          title="This Week"
          value={data.inspectionQueue.scheduledThisWeek}
          description="Week schedule"
          icon={CheckCircle}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Overdue"
          value={data.inspectionQueue.overdue}
          description="Needs attention"
          icon={AlertCircle}
          iconClassName="bg-destructive/10"
        />
      </div>

      {/* Personal Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Completed This Month"
          value={data.personalStats.completedThisMonth}
          description="Inspections done"
          icon={CheckCircle}
        />
        <StatCard
          title="Pass Rate"
          value={`${data.personalStats.passRate.toFixed(1)}%`}
          description="Success rate"
          icon={CheckCircle}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Avg Inspection Time"
          value={`${data.personalStats.avgInspectionTime.toFixed(0)} min`}
          description="Per inspection"
          icon={Clock}
        />
        <StatCard
          title="Avg Repair Cost"
          value={`$${data.personalStats.avgRepairCost.toLocaleString()}`}
          description="Per failed inspection"
          icon={Wrench}
        />
      </div>

      {/* Vehicle Status */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Vehicle Status</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Needing Inspection
            </p>
            <p className="text-warning text-3xl font-bold">
              {data.vehicleStatus.needingInspection}
            </p>
          </div>
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Failed Inspections
            </p>
            <p className="text-destructive text-3xl font-bold">
              {data.vehicleStatus.failedInspections}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">In Maintenance</p>
            <p className="text-3xl font-bold">
              {data.vehicleStatus.inMaintenance}
            </p>
          </div>
        </div>
      </Card>

      {/* Assigned Tasks */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Assigned Tasks</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold">{data.assignedTasks.total}</p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">High Priority</p>
            <p className="text-destructive text-3xl font-bold">
              {data.assignedTasks.highPriority}
            </p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Due Today</p>
            <p className="text-warning text-3xl font-bold">
              {data.assignedTasks.dueToday}
            </p>
          </div>
        </div>
      </Card>

      {/* Location Summary and Recent Inspections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Location Summary */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Inspections by Location</h3>
          </div>
          {data.locationSummary.length === 0 ? (
            <WidgetEmpty
              title="No Location Data"
              message="Location summary will appear once inspections are scheduled."
            />
          ) : (
            <div className="space-y-3">
              {data.locationSummary.map((location, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {location.locationName}
                    </span>
                    <Badge variant="secondary">
                      {location.pendingCount} pending
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {location.completedThisWeek} completed this week
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Inspections */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Recent Inspections</h3>
          </div>
          {data.recentInspections.length === 0 ? (
            <WidgetEmpty
              title="No Inspections"
              message="Recent inspections will appear here."
            />
          ) : (
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-3">
                {data.recentInspections.map((inspection) => (
                  <div key={inspection.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {inspection.carDetails}
                      </span>
                      <Badge
                        variant={
                          inspection.status === "PASSED"
                            ? "default"
                            : inspection.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {inspection.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      {inspection.findings}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(inspection.completedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>

      {/* Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
