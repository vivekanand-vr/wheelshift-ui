"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Typography variant="h2" className="text-2xl font-bold">
          {value}
        </Typography>
        {trend && (
          <div className="mt-1 flex items-center gap-1">
            <Typography
              variant="small"
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success-600" : "text-error-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </Typography>
            <Typography variant="muted" className="text-xs">
              from last month
            </Typography>
          </div>
        )}
        {description && (
          <Typography variant="muted" className="mt-1 text-xs">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
