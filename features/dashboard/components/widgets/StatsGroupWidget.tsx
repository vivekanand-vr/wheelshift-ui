"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "lucide-react";

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

interface StatsGroupWidgetProps {
  title: string;
  icon?: LucideIcon;
  stats: StatItemProps[];
}

export const StatsGroupWidget = ({
  title,
  icon: Icon,
  stats,
}: StatsGroupWidgetProps) => {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-primary h-5 w-5" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2 pr-4">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  {StatIcon && (
                    <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <StatIcon className="text-primary h-4 w-4" />
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs font-medium">
                    {stat.label}
                  </span>
                </div>
                <span className="text-base font-bold">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
