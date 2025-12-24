"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  PieChart,
  Receipt,
} from "lucide-react";
import { FinanceDashboardResponse } from "../../types";
import { StatsGroupWidget } from "../widgets/StatsGroupWidget";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinanceDashboardProps {
  data: FinanceDashboardResponse;
}

export const FinanceDashboard = ({ data }: FinanceDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Stats Groups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsGroupWidget
          title="Financial Overview"
          icon={DollarSign}
          stats={[
            {
              label: "Total Revenue",
              value: `$${data.financialOverview.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Total Expenses",
              value: `$${data.financialOverview.totalExpenses.toLocaleString()}`,
              icon: TrendingDown,
            },
            {
              label: "Net Profit",
              value: `$${data.financialOverview.netProfit.toLocaleString()}`,
              icon: TrendingUp,
            },
            {
              label: "Profit Margin",
              value: `${data.financialOverview.profitMargin.toFixed(1)}%`,
              icon: PieChart,
            },
          ]}
        />

        <StatsGroupWidget
          title="Transactions & Payments"
          icon={CreditCard}
          stats={[
            {
              label: "Pending Transactions",
              value: data.transactions.pendingCount,
              icon: CreditCard,
            },
            {
              label: "Completed This Month",
              value: data.transactions.completedThisMonth,
              icon: Receipt,
            },
            {
              label: "Total Amount",
              value: `$${data.transactions.totalAmount.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Cash Flow",
              value: `$${data.financialOverview.cashFlow.toLocaleString()}`,
              icon: TrendingUp,
            },
          ]}
        />

        <StatsGroupWidget
          title="Aging & Budget"
          icon={AlertCircle}
          stats={[
            {
              label: "Overdue Payments",
              value: data.aging.overduePayments,
              icon: AlertCircle,
            },
            {
              label: "Overdue Amount",
              value: `$${data.aging.overdueAmount.toLocaleString()}`,
              icon: DollarSign,
            },
            {
              label: "Pending Deposits",
              value: data.aging.pendingDeposits,
              icon: Receipt,
            },
            {
              label: "Budget Utilization",
              value: `${data.budgetTracking.utilizationRate}%`,
              icon: PieChart,
            },
          ]}
        />
      </div>

      {/* Middle Row - Profitability and Budget */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Profitability Metrics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-1 text-sm">
                Average Profit per Vehicle
              </p>
              <p className="text-2xl font-bold">
                ${data.profitability.avgProfitPerVehicle.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">
                Average Margin
              </p>
              <p className="text-2xl font-bold">
                {data.profitability.avgMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="text-primary h-5 w-5" />
              <h3 className="text-lg font-semibold">Budget Tracking</h3>
            </div>
            <Badge variant="default">
              {data.budgetTracking.utilizationRate}%
            </Badge>
          </div>
          <div className="space-y-4">
            <Progress value={data.budgetTracking.utilizationRate} />
            <p className="text-muted-foreground text-xs">
              ${data.budgetTracking.spent.toLocaleString()} of $
              {data.budgetTracking.totalBudget.toLocaleString()} spent
            </p>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {Object.entries(data.budgetTracking.categories).map(
                  ([category, amount]) => (
                    <div
                      key={category}
                      className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                    >
                      <span className="text-xs font-medium capitalize">
                        {category.toLowerCase().replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-bold">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
