"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { RevenueMetrics } from "../../types";
import { WidgetEmpty } from "./WidgetEmpty";

interface RevenueChartWidgetProps {
  data: RevenueMetrics;
}

export const RevenueChartWidget = ({ data }: RevenueChartWidgetProps) => {
  if (!data.revenueTrend || data.revenueTrend.length === 0) {
    return (
      <WidgetEmpty
        title="No Revenue Data"
        message="Revenue data will appear once transactions are recorded."
        icon={<TrendingUp className="text-muted-foreground mb-4 h-12 w-12" />}
      />
    );
  }

  const maxRevenue = Math.max(...data.revenueTrend.map((d) => d.revenue));

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="text-primary h-5 w-5" />
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
      </div>

      <div className="space-y-4">
        {data.revenueTrend.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.monthName}</span>
              <div className="text-right">
                <span className="font-semibold">
                  ${item.revenue.toLocaleString()}
                </span>
                <span className="text-muted-foreground ml-2">
                  ({item.salesCount} sales)
                </span>
              </div>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{
                  width: `${(item.revenue / maxRevenue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
