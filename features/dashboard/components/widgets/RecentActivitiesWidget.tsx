"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { ActivityLog } from "../../types";
import { WidgetEmpty } from "./WidgetEmpty";
import { formatDistanceToNow } from "date-fns";

interface RecentActivitiesWidgetProps {
  activities: ActivityLog[];
}

const getActivityTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    SALE: "default",
    INQUIRY: "secondary",
    RESERVATION: "warning",
    INSPECTION: "info",
    MAINTENANCE: "warning",
    MOVEMENT: "secondary",
  };
  return colorMap[type] || "default";
};

export const RecentActivitiesWidget = ({
  activities,
}: RecentActivitiesWidgetProps) => {
  if (activities.length === 0) {
    return (
      <WidgetEmpty
        title="No Recent Activities"
        message="No activities to display at this time."
        icon={<Activity className="text-muted-foreground mb-4 h-12 w-12" />}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="text-primary h-5 w-5" />
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>

      <ScrollArea className="h-96 pr-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-primary h-2 w-2 rounded-full" />
                {index < activities.length - 1 && (
                  <div className="bg-border mt-2 h-full w-px" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge
                    variant={getActivityTypeColor(activity.type) as any}
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  By {activity.performedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
