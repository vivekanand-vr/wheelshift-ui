"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  PieChart,
} from "lucide-react";
import { FinanceDashboardResponse } from "../../types";
import { StatCard } from "../widgets/StatCard";
import { NotificationsWidget } from "../widgets/NotificationsWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WidgetEmpty } from "../widgets/WidgetEmpty";

interface FinanceDashboardProps {
  data: FinanceDashboardResponse;
}

export const FinanceDashboard = ({ data }: FinanceDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Revenue"
          value={`$${data.financialOverview.totalRevenue.toLocaleString()}`}
          description="All time"
          icon={DollarSign}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Total Expenses"
          value={`$${data.financialOverview.totalExpenses.toLocaleString()}`}
          description="All time"
          icon={TrendingDown}
          iconClassName="bg-red-500/10"
        />
        <StatCard
          title="Net Profit"
          value={`$${data.financialOverview.netProfit.toLocaleString()}`}
          description="Revenue - Expenses"
          icon={TrendingUp}
          iconClassName="bg-green-500/10"
        />
        <StatCard
          title="Profit Margin"
          value={`${data.financialOverview.profitMargin.toFixed(1)}%`}
          description="Overall margin"
          icon={PieChart}
        />
        <StatCard
          title="Cash Flow"
          value={`$${data.financialOverview.cashFlow.toLocaleString()}`}
          description="Current balance"
          icon={CreditCard}
          iconClassName="bg-blue-500/10"
        />
      </div>

      {/* Transactions Summary */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Transaction Summary</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Pending Transactions
            </p>
            <p className="text-warning text-3xl font-bold">
              {data.transactions.pendingCount}
            </p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Completed This Month
            </p>
            <p className="text-3xl font-bold text-green-600">
              {data.transactions.completedThisMonth}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Total Amount</p>
            <p className="text-3xl font-bold">
              ${data.transactions.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Profitability Metrics */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Profitability Analysis</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">
              Average Profit per Vehicle
            </p>
            <p className="text-3xl font-bold">
              ${data.profitability.avgProfitPerVehicle.toLocaleString()}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-sm">Average Margin</p>
            <p className="text-3xl font-bold">
              {data.profitability.avgMargin.toFixed(1)}%
            </p>
          </div>
        </div>
        {data.profitability.vehicleProfitability.length > 0 && (
          <div className="mt-4">
            <h4 className="text-muted-foreground mb-3 text-sm font-medium">
              Top Profitable Vehicles
            </h4>
            <div className="space-y-2">
              {data.profitability.vehicleProfitability
                .slice(0, 5)
                .map((vehicle: any, index: number) => (
                  <div
                    key={index}
                    className="bg-background rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {vehicle.name || `Vehicle #${index + 1}`}
                      </span>
                      <Badge variant="default">
                        ${vehicle.profit?.toLocaleString() || 0}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>

      {/* Aging Analysis and Budget */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Aging Analysis */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Aging Analysis</h3>
          </div>
          <div className="space-y-4">
            {data.aging.overduePayments > 0 && (
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-sm">
                  Overdue Payments
                </p>
                <p className="text-destructive text-2xl font-bold">
                  {data.aging.overduePayments}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Amount: ${data.aging.overdueAmount.toLocaleString()}
                </p>
              </div>
            )}
            {data.aging.pendingDeposits > 0 && (
              <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-sm">
                  Pending Deposits
                </p>
                <p className="text-warning text-2xl font-bold">
                  {data.aging.pendingDeposits}
                </p>
              </div>
            )}
            {data.aging.overduePayments === 0 &&
              data.aging.pendingDeposits === 0 && (
                <WidgetEmpty
                  title="All Clear"
                  message="No overdue payments or pending deposits."
                />
              )}
          </div>
        </Card>

        {/* Budget Tracking */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Budget Tracking</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="text-sm font-semibold">
                  ${data.budgetTracking.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Spent</span>
                <span className="text-sm font-semibold">
                  ${data.budgetTracking.spent.toLocaleString()}
                </span>
              </div>
              <Progress
                value={data.budgetTracking.utilizationRate}
                className="mb-2 h-2"
              />
              <p className="text-muted-foreground text-center text-xs">
                {data.budgetTracking.utilizationRate.toFixed(1)}% utilized
              </p>
            </div>
            {Object.keys(data.budgetTracking.categories).length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                  By Category
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.budgetTracking.categories).map(
                    ([category, amount]) => (
                      <div
                        key={category}
                        className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                      >
                        <span className="text-sm capitalize">
                          {category.replace("_", " ").toLowerCase()}
                        </span>
                        <span className="text-sm font-semibold">
                          ${(amount as number).toLocaleString()}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <NotificationsWidget data={data.notifications} />
    </div>
  );
};
