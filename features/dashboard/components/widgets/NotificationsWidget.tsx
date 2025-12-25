"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { NotificationsData } from "../../types";
import { WidgetEmpty } from "./WidgetEmpty";
import { formatDistanceToNow } from "date-fns";

interface NotificationsWidgetProps {
  data: NotificationsData;
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "ERROR":
      return "destructive";
    case "WARNING":
      return "warning";
    default:
      return "default";
  }
};

export const NotificationsWidget = ({ data }: NotificationsWidgetProps) => {
  if (data.recent.length === 0) {
    return (
      <WidgetEmpty
        title="No Notifications"
        message="You're all caught up! No new notifications."
        icon={<Bell className="text-muted-foreground mb-4 h-12 w-12" />}
      />
    );
  }

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        {data.unreadCount > 0 && (
          <Badge variant="default">{data.unreadCount} New</Badge>
        )}
      </div>

      <ScrollArea className="h-80 pr-4">
        <div className="space-y-2">
          {data.recent.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-2 transition-colors ${
                !notification.isRead
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {getSeverityIcon(notification.severity)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-medium">
                      {notification.subject}
                    </h4>
                    {!notification.isRead && (
                      <div className="bg-primary h-2 w-2 shrink-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-[10px]">
                    {notification.body}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <Badge
                      variant={getSeverityColor(notification.severity) as any}
                      className="text-[10px]"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
