"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RecentActivity as RecentActivityType } from "../types";
import { Package, ShoppingCart, User } from "lucide-react";

interface RecentActivityProps {
  activities: RecentActivityType[];
}

const iconMap = {
  order: ShoppingCart,
  customer: User,
  product: Package,
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your store</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-100 pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="bg-primary-100 dark:bg-primary-900 flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Typography variant="small" className="font-medium">
                        {activity.title}
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        {activity.timestamp}
                      </Typography>
                    </div>
                    <Typography variant="muted" className="text-sm">
                      {activity.description}
                    </Typography>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
