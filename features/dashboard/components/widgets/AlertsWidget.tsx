"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { SystemAlerts } from "../../types";
import { WidgetEmpty } from "./WidgetEmpty";

interface AlertsWidgetProps {
  data: SystemAlerts;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "ERROR":
      return <AlertCircle className="text-destructive h-4 w-4" />;
    case "WARNING":
      return <AlertTriangle className="text-warning h-4 w-4" />;
    default:
      return <Info className="text-info h-4 w-4" />;
  }
};

export const AlertsWidget = ({ data }: AlertsWidgetProps) => {
  const totalAlerts =
    data.expiringReservations +
    data.inspectionsDue +
    data.locationCapacityWarnings;

  if (totalAlerts === 0 && data.details.length === 0) {
    return (
      <WidgetEmpty
        title="No Alerts"
        message="Everything looks good! No alerts at this time."
        icon={
          <AlertTriangle className="text-muted-foreground mb-4 h-12 w-12" />
        }
      />
    );
  }

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-warning h-5 w-5" />
          <Typography variant="large">System Alerts</Typography>
        </div>
        {totalAlerts > 0 && (
          <Badge variant="destructive">{totalAlerts} Total</Badge>
        )}
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-2 pr-4">
          {data.expiringReservations > 0 && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-2">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="text-warning h-4 w-4" />
                <Typography variant="small" className="text-xs">
                  Expiring Reservations
                </Typography>
              </div>
              <Typography variant="muted" className="text-[10px]">
                {data.expiringReservations} reservation
                {data.expiringReservations > 1 ? "s" : ""} expiring within 3
                days
              </Typography>
            </div>
          )}

          {data.inspectionsDue > 0 && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-2">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="text-warning h-4 w-4" />
                <Typography variant="small" className="text-xs">
                  Inspections Due
                </Typography>
              </div>
              <Typography variant="muted" className="text-[10px]">
                {data.inspectionsDue} vehicle
                {data.inspectionsDue > 1 ? "s need" : " needs"} inspection
              </Typography>
            </div>
          )}

          {data.locationCapacityWarnings > 0 && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-2">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="text-warning h-4 w-4" />
                <Typography variant="small" className="text-xs">
                  Capacity Warnings
                </Typography>
              </div>
              <Typography variant="muted" className="text-[10px]">
                {data.locationCapacityWarnings} location
                {data.locationCapacityWarnings > 1 ? "s" : ""} near capacity
              </Typography>
            </div>
          )}

          {data.details.map((alert, index) => (
            <div
              key={index}
              className={`rounded-lg border p-2 ${
                alert.severity === "ERROR"
                  ? "bg-destructive/10 border-destructive/20"
                  : alert.severity === "WARNING"
                    ? "bg-warning/10 border-warning/20"
                    : "bg-info/10 border-info/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {getSeverityIcon(alert.severity)}
                <Typography variant="small" className="text-xs">
                  {alert.message}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
