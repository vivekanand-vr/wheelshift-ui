"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  return (
    <Card className="relative overflow-visible p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="text-primary h-5 w-5" />
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
      </div>

      <div className="relative h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="monthName"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                zIndex: 9999,
              }}
              wrapperStyle={{ zIndex: 9999 }}
              formatter={(value: number | undefined) => [
                `$${value?.toLocaleString() ?? 0}`,
                "Revenue",
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
