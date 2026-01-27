"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  iconClassName?: string;
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatCardProps) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Typography variant="small" className="text-muted-foreground">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {description && (
            <Typography variant="muted" className="text-xs">
              {description}
            </Typography>
          )}
          {trend && (
            <Badge
              variant={trend.value >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg",
              iconClassName
            )}
          >
            <Icon className="text-primary h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
