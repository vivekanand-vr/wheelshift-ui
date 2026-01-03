# Dashboard Feature Documentation

The WheelShift Pro dashboard system provides role-based, personalized dashboards with comprehensive widgets, loading states, error handling, and responsive design.

## 🎯 Overview

### What's Included

#### Role-Based Dashboards (5)

- ✅ **Admin Dashboard** - Complete system overview
- ✅ **Sales Dashboard** - Personal sales metrics and pipeline
- ✅ **Inspector Dashboard** - Inspection queue and workload
- ✅ **Finance Dashboard** - Financial metrics and analysis
- ✅ **Store Manager Dashboard** - Location and capacity management

#### Common Widgets (8)

- ✅ **StatCard** - Metric display with icons and trends
- ✅ **NotificationsWidget** - Recent notifications with unread count
- ✅ **RecentActivitiesWidget** - Timeline of system activities
- ✅ **RevenueChartWidget** - Revenue trend visualization
- ✅ **AlertsWidget** - System alerts and warnings
- ✅ **WidgetSkeleton** - Loading states (4 variants)
- ✅ **WidgetError** - Error handling with retry
- ✅ **WidgetEmpty** - Empty states with helpful messages

#### Features

- ✅ **Loading States** - Shimmer skeleton effects
- ✅ **Error States** - Clear error messages with retry
- ✅ **Empty States** - Helpful messages for no data
- ✅ **Auto-Refresh** - Data updates every 5 minutes
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Light/Dark Mode** - Theme support
- ✅ **Type Safety** - Full TypeScript coverage

## 🏗️ Architecture

### Directory Structure

```
features/dashboard/
├── api/
│   ├── services.ts              # Pure API calls
│   ├── queries.ts               # React Query configurations
│   └── index.ts
├── components/
│   ├── dashboards/              # Role-specific layouts
│   │   ├── AdminDashboard.tsx
│   │   ├── SalesDashboard.tsx
│   │   ├── InspectorDashboard.tsx
│   │   ├── FinanceDashboard.tsx
│   │   └── StoreManagerDashboard.tsx
│   ├── widgets/                 # Reusable widgets
│   │   ├── StatCard.tsx
│   │   ├── NotificationsWidget.tsx
│   │   ├── RecentActivitiesWidget.tsx
│   │   ├── RevenueChartWidget.tsx
│   │   ├── AlertsWidget.tsx
│   │   ├── WidgetSkeleton.tsx
│   │   ├── WidgetError.tsx
│   │   └── WidgetEmpty.tsx
│   ├── DashboardContainer.tsx   # Main container with role routing
│   └── index.ts
├── hooks/
│   └── index.ts                 # Custom hooks
├── types/
│   └── index.ts                 # TypeScript definitions
├── constants/
│   └── mockData.ts              # Development mock data
└── index.ts                     # Feature exports
```

### Data Flow

```
Component → Hook → Queries → Services → Backend API
    ↓         ↓        ↓          ↓
  Render   Logic   React Query  Axios
```

## 👥 Role-Based Dashboards

### Admin Dashboard

**Target Users**: ADMIN, SUPER_ADMIN

**Widgets**:

- Overview Statistics (Total Cars, Available, In Transit, Revenue)
- Revenue Metrics (Total Revenue, Monthly, Profit Margin, Commission)
- Inquiries & Reservations (New Inquiries, Pending, Completed Reservations, Conversion Rate)
- Revenue Trend Chart (Last 6 months)
- Inventory Health (by status)
- Top Performers (Employee performance)
- System Alerts
- Recent Activities
- Notifications

**Use Cases**:

- Monitor overall business health
- Track employee performance
- Review financial metrics
- Identify system issues
- View inventory status

### Sales Dashboard

**Target Users**: SALES

**Widgets**:

- Personal Statistics (Sales Made, Inquiries, Follow-ups, Conversion Rate)
- Monthly Target Progress
- Sales Pipeline (Leads, Qualified, Negotiation, Won/Lost)
- Quick Actions (Create Inquiry, Schedule Test Drive, Follow-up Call, View Inventory)
- Available Inventory Summary
- Notifications

**Use Cases**:

- Track personal sales goals
- Manage customer pipeline
- View commission earnings
- Handle follow-ups
- Browse available inventory

### Inspector Dashboard

**Target Users**: INSPECTOR

**Widgets**:

- Inspection Queue (Pending, In Progress, Overdue, Completed Today)
- Personal Performance (Total Inspections, Avg. Time, Passed Rate, Today's Count)
- Vehicle Status Grid
- Assigned Tasks Grid
- Location Summary
- Recent Inspections
- Notifications

**Use Cases**:

- Manage inspection queue
- Track completion rates
- Identify overdue inspections
- Monitor vehicle status
- View assigned tasks

### Finance Dashboard

**Target Users**: FINANCE

**Widgets**:

- Financial Overview (Total Revenue, Expenses, Net Profit, Cash Flow, Overdue)
- Transaction Summary (Today, This Week, This Month, Pending)
- Profitability Analysis (by category)
- Aging Analysis (Current, 30-60 days, 60-90 days, Over 90 days)
- Budget Tracking (by department)
- Notifications

**Use Cases**:

- Review financial statements
- Track transactions
- Analyze profitability
- Monitor budget usage
- Handle overdue payments

### Store Manager Dashboard

**Target Users**: STORE_MANAGER

**Widgets**:

- Location Overview (Total Vehicles, Capacity, In/Out Today, Available Space)
- Capacity Overview
- Vehicle Distribution (by location and status)
- Movement Activity (Incoming/Outgoing today)
- Capacity Alerts
- Maintenance Status
- Location Performance
- Notifications

**Use Cases**:

- Manage location capacity
- Track vehicle movements
- Monitor maintenance status
- Optimize space utilization
- View location performance

## 📦 Components

### 1. DashboardContainer

Main container component that handles loading, errors, and role-based routing.

```tsx
import { DashboardContainer } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardContainer />;
}
```

**Features**:

- Auto-detects user role
- Loading states with shimmer
- Error handling with retry
- Routes to correct dashboard

### 2. StatCard

Displays a single metric with optional icon and trend.

```tsx
<StatCard
  title="Total Cars"
  value={150}
  description="Available for sale"
  icon={Car}
  trend={{ value: 5.2, label: "vs last month" }}
/>
```

**Props**:

- `title`: string - Card title
- `value`: number | string - Main metric value
- `description?`: string - Additional context
- `icon?`: LucideIcon - Icon component
- `trend?`: { value: number, label: string } - Trend indicator

### 3. NotificationsWidget

Shows recent notifications with unread count.

```tsx
<NotificationsWidget data={notificationsData} />
```

### 4. RecentActivitiesWidget

Timeline of recent system activities.

```tsx
<RecentActivitiesWidget activities={activityLogs} />
```

### 5. RevenueChartWidget

Bar chart showing revenue trends.

```tsx
<RevenueChartWidget data={revenueMetrics} />
```

### 6. AlertsWidget

System alerts and warnings.

```tsx
<AlertsWidget data={systemAlerts} />
```

### 7. WidgetSkeleton

Loading states for different widget types.

```tsx
<StatCardSkeleton />
<ChartSkeleton />
<ListSkeleton />
```

### 8. WidgetError

Error state with retry functionality.

```tsx
<WidgetError
  title="Failed to Load"
  message="Unable to fetch data"
  onRetry={() => refetch()}
/>
```

### 9. WidgetEmpty

Empty state for widgets with no data.

```tsx
<WidgetEmpty
  title="No Data"
  message="No activities to display"
  icon={<ActivityIcon />}
/>
```

## 🔌 API Integration

### API Service Layer

```typescript
// features/dashboard/api/services.ts
export const dashboardApi = {
  // Auto-detect role from /me endpoint
  getCurrentUserDashboard: async (): Promise<DashboardResponse> => {
    const response = await axiosInstance.get("/dashboard/me");
    return response.data;
  },

  // Role-specific endpoints
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    const response = await axiosInstance.get("/dashboard/admin");
    return response.data;
  },

  getSalesDashboard: async (): Promise<SalesDashboardResponse> => {
    const response = await axiosInstance.get("/dashboard/sales");
    return response.data;
  },

  // ... other endpoints
};
```

### React Query Integration

```typescript
// features/dashboard/api/queries.ts
import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "./services";

export const dashboardQueries = {
  current: () =>
    queryOptions({
      queryKey: ["dashboard", "current"],
      queryFn: dashboardApi.getCurrentUserDashboard,
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    }),

  byRole: (role: DashboardRole) =>
    queryOptions({
      queryKey: ["dashboard", role],
      queryFn: () => {
        // Call appropriate API based on role
      },
      staleTime: 5 * 60 * 1000,
    }),
};
```

### Custom Hooks

```typescript
// features/dashboard/hooks/index.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../api/queries";

export const useDashboard = (role?: DashboardRole) => {
  return useQuery(
    role ? dashboardQueries.byRole(role) : dashboardQueries.current()
  );
};

export const useCurrentDashboard = () => {
  return useQuery(dashboardQueries.current());
};
```

**Usage**:

```tsx
const { data, isLoading, error, refetch } = useDashboard();

if (isLoading) return <LoadingState />;
if (error) return <ErrorState onRetry={refetch} />;

return <Dashboard data={data} />;
```
