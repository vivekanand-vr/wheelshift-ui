"use client";

import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Wrench,
  Calendar,
} from "lucide-react";
import { InspectorDashboardResponse } from "../../types";
import { StatsGroupWidget } from "../widgets/StatsGroupWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { formatDistanceToNow } from "date-fns";

interface InspectorDashboardProps {
  data: InspectorDashboardResponse;
}

export const InspectorDashboard = ({ data }: InspectorDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Stats Groups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsGroupWidget
          title="Inspection Queue"
          icon={ClipboardCheck}
          stats={[
            {
              label: "Pending Inspections",
              value: data.inspectionQueue.pendingInspections,
              icon: ClipboardCheck,
            },
            {
              label: "Scheduled Today",
              value: data.inspectionQueue.scheduledToday,
              icon: Clock,
            },
            {
              label: "This Week",
              value: data.inspectionQueue.scheduledThisWeek,
              icon: Calendar,
            },
            {
              label: "Overdue",
              value: data.inspectionQueue.overdue,
              icon: AlertCircle,
            },
          ]}
        />

        <StatsGroupWidget
          title="Personal Performance"
          icon={CheckCircle}
          stats={[
            {
              label: "Completed This Month",
              value: data.personalStats.completedThisMonth,
              icon: CheckCircle,
            },
            {
              label: "Pass Rate",
              value: `${data.personalStats.passRate.toFixed(1)}%`,
              icon: CheckCircle,
            },
            {
              label: "Avg Inspection Time",
              value: `${data.personalStats.avgInspectionTime.toFixed(0)} min`,
              icon: Clock,
            },
            {
              label: "Avg Repair Cost",
              value: `$${data.personalStats.avgRepairCost.toLocaleString()}`,
              icon: Wrench,
            },
          ]}
        />

        <StatsGroupWidget
          title="Vehicle Status"
          icon={Wrench}
          stats={[
            {
              label: "Needing Inspection",
              value: data.vehicleStatus.needingInspection,
              icon: AlertCircle,
            },
            {
              label: "Failed Inspections",
              value: data.vehicleStatus.failedInspections,
              icon: AlertCircle,
            },
            {
              label: "In Maintenance",
              value: data.vehicleStatus.inMaintenance,
              icon: Wrench,
            },
            {
              label: "High Priority Tasks",
              value: data.assignedTasks.highPriority,
              icon: AlertCircle,
            },
          ]}
        />
      </div>

      {/* Middle Row - Location Summary and Recent Inspections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <Typography variant="large">Location Summary</Typography>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {data.locationSummary.map((location, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <Typography variant="small">
                      {location.locationName}
                    </Typography>
                    <Badge variant="outline">
                      {location.pendingCount} pending
                    </Badge>
                  </div>
                  <Typography variant="muted" className="text-xs">
                    {location.completedThisWeek} completed this week
                  </Typography>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardCheck className="text-primary h-5 w-5" />
            <Typography variant="large">Recent Inspections</Typography>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {data.recentInspections.map((inspection) => (
                <div key={inspection.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {inspection.carDetails}
                    </span>
                    <Badge
                      variant={
                        inspection.status === "PASSED"
                          ? "default"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {inspection.status}
                    </Badge>
                  </div>
                  <Typography variant="muted" className="mb-1 text-[10px]">
                    {inspection.findings}
                  </Typography>
                  <Typography variant="muted" className="text-[10px]">
                    {formatDistanceToNow(new Date(inspection.completedAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Bottom Row - Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
