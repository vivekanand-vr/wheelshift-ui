# Dashboard Implementation Guide

## Overview

The WheelShift Pro UI dashboard system provides role-based dashboards with comprehensive widgets, loading states, error handling, and responsive design. This implementation follows best practices for React, TypeScript, and Next.js applications.

## Architecture

### Directory Structure

```
features/dashboard/
├── api/
│   └── index.ts                 # API service layer
├── components/
│   ├── dashboards/              # Role-specific dashboard layouts
│   │   ├── AdminDashboard.tsx
│   │   ├── SalesDashboard.tsx
│   │   ├── InspectorDashboard.tsx
│   │   ├── FinanceDashboard.tsx
│   │   └── StoreManagerDashboard.tsx
│   ├── widgets/                 # Reusable widget components
│   │   ├── StatCard.tsx
│   │   ├── NotificationsWidget.tsx
│   │   ├── RecentActivitiesWidget.tsx
│   │   ├── RevenueChartWidget.tsx
│   │   ├── AlertsWidget.tsx
│   │   ├── WidgetSkeleton.tsx
│   │   ├── WidgetError.tsx
│   │   └── WidgetEmpty.tsx
│   ├── DashboardContainer.tsx   # Main container with role routing
│   └── index.ts                 # Component exports
├── hooks/
│   └── index.ts                 # Custom hooks (useDashboard)
├── types/
│   └── index.ts                 # TypeScript type definitions
└── index.ts                     # Feature exports
```

## Key Components

### 1. DashboardContainer

The main container component that handles:

- Loading states with shimmer effects
- Error handling with retry functionality
- Role-based dashboard routing
- Auto-detection of dashboard type from API response

**Usage:**

```tsx
import { DashboardContainer } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardContainer />;
}
```

### 2. Role-Specific Dashboards

Each role has a dedicated dashboard component:

#### AdminDashboard

- **Widgets**: Overview stats, revenue metrics, inventory health, top employees, alerts, activities, notifications
- **Target Users**: ADMIN, SUPER_ADMIN
- **Key Features**: Complete system overview, employee performance tracking

#### SalesDashboard

- **Widgets**: Personal stats, sales pipeline, performance metrics, quick actions, available inventory, notifications
- **Target Users**: SALES
- **Key Features**: Sales funnel, conversion tracking, commission earned

#### InspectorDashboard

- **Widgets**: Inspection queue, personal stats, vehicle status, assigned tasks, location summary, recent inspections, notifications
- **Target Users**: INSPECTOR
- **Key Features**: Inspection workflow, vehicle status tracking

#### FinanceDashboard

- **Widgets**: Financial overview, transaction summary, profitability analysis, aging analysis, budget tracking, notifications
- **Target Users**: FINANCE
- **Key Features**: Financial metrics, P&L tracking, budget management

#### StoreManagerDashboard

- **Widgets**: Location overview, vehicle distribution, movement activity, capacity alerts, maintenance status, performance metrics, notifications
- **Target Users**: STORE_MANAGER
- **Key Features**: Location capacity management, vehicle distribution

### 3. Common Widgets

#### StatCard

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

#### NotificationsWidget

Shows recent notifications with unread count.

```tsx
<NotificationsWidget data={notificationsData} />
```

#### RecentActivitiesWidget

Timeline of recent system activities.

```tsx
<RecentActivitiesWidget activities={activityLogs} />
```

#### RevenueChartWidget

Bar chart showing revenue trends.

```tsx
<RevenueChartWidget data={revenueMetrics} />
```

#### AlertsWidget

System alerts and warnings.

```tsx
<AlertsWidget data={systemAlerts} />
```

### 4. State Management Components

#### WidgetSkeleton

Loading states for different widget types.

```tsx
<StatCardSkeleton />
<ChartSkeleton />
<ListSkeleton />
```

#### WidgetError

Error state with retry functionality.

```tsx
<WidgetError
  title="Failed to Load"
  message="Unable to fetch data"
  onRetry={() => refetch()}
/>
```

#### WidgetEmpty

Empty state for widgets with no data.

```tsx
<WidgetEmpty
  title="No Data"
  message="No activities to display"
  icon={<ActivityIcon />}
/>
```

## API Integration

### API Service (`features/dashboard/api/index.ts`)

```typescript
export const dashboardApi = {
  // Auto-detect role from /me endpoint
  getCurrentUserDashboard: async () => Promise<DashboardResponse>,

  // Role-specific endpoints
  getAdminDashboard: async () => Promise<AdminDashboardResponse>,
  getSalesDashboard: async () => Promise<SalesDashboardResponse>,
  getInspectorDashboard: async () => Promise<InspectorDashboardResponse>,
  getFinanceDashboard: async () => Promise<FinanceDashboardResponse>,
  getStoreManagerDashboard: async () => Promise<StoreManagerDashboardResponse>,
};
```

### Custom Hook (`features/dashboard/hooks/index.ts`)

```typescript
export const useDashboard = (role?: DashboardRole) => {
  return useQuery({
    queryKey: ["dashboard", role || "current"],
    queryFn: () => fetchDashboardByRole(role),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};
```

**Usage:**

```tsx
const { data, isLoading, error, refetch } = useDashboard();
```

## Type Definitions

All dashboard types are defined in `features/dashboard/types/index.ts`:

```typescript
export interface AdminDashboardResponse {
  overview: OverviewStats;
  revenue: RevenueMetrics;
  inventory: InventoryHealth;
  recentActivities: ActivityLog[];
  topEmployees: EmployeePerformance[];
  alerts: SystemAlerts;
  notifications: NotificationsWidget;
}

// ... other dashboard types
```

## Features

### 1. Loading States

Every widget has a shimmer loading effect:

```tsx
if (isLoading) {
  return <StatCardSkeleton />;
}
```

### 2. Error Handling

Graceful error handling with retry:

```tsx
if (error) {
  return <WidgetError message={error.message} onRetry={() => refetch()} />;
}
```

### 3. Empty States

User-friendly empty states:

```tsx
if (data.length === 0) {
  return (
    <WidgetEmpty
      title="No Data"
      message="Data will appear here once available"
    />
  );
}
```

### 4. Responsive Design

All components are fully responsive:

- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 4-column grid

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Widgets */}</div>
```

### 5. Auto-Refresh

Dashboards automatically refresh every 5 minutes:

```typescript
refetchInterval: 5 * 60 * 1000;
```

### 6. Role-Based Routing

The system automatically detects the user's role and displays the appropriate dashboard:

```typescript
function detectDashboardType(data: any): DashboardRole | null {
  if ("overview" in data && "revenue" in data) return "ADMIN";
  if ("personalStats" in data && "pipeline" in data) return "SALES";
  // ... other checks
}
```

## Styling

### Theme Integration

All components use Tailwind CSS and support light/dark modes:

```tsx
className = "p-6 rounded-lg bg-muted/50 border";
```

### Color Coding

- **Primary**: Main actions and highlights
- **Success/Green**: Positive metrics
- **Warning/Orange**: Attention needed
- **Destructive/Red**: Critical alerts
- **Muted**: Secondary information

### Icons

Using `lucide-react` for consistent iconography:

```tsx
import { Car, DollarSign, Users, TrendingUp } from "lucide-react";
```

## Performance Optimization

### 1. React Query Caching

```typescript
staleTime: 5 * 60 * 1000; // Data stays fresh for 5 minutes
```

### 2. Code Splitting

Each dashboard is lazy-loaded when needed.

### 3. Memoization

Large lists use React memoization to prevent unnecessary re-renders.

### 4. Parallel Loading

Widgets load independently, preventing blocking.

## Testing

### Unit Tests

Test individual widget components:

```typescript
describe('StatCard', () => {
  it('renders correctly with all props', () => {
    render(
      <StatCard
        title="Test"
        value={100}
        icon={Car}
      />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test dashboard rendering with mock data:

```typescript
describe('AdminDashboard', () => {
  it('renders all widgets with data', () => {
    render(<AdminDashboard data={mockAdminData} />);
    expect(screen.getByText('Total Cars')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Dashboard not loading

**Solution**: Check that the user has proper role permissions and the API endpoint is accessible.

### Issue: Shimmer not showing

**Solution**: Ensure `isLoading` state is properly passed to skeleton components.

### Issue: Empty states not displaying

**Solution**: Verify empty state conditions are checking for both `null` and empty arrays.

### Issue: Notifications not updating

**Solution**: Check that React Query cache is being invalidated properly when new notifications arrive.

## Best Practices

1. **Always handle loading states**: Never show raw data immediately
2. **Provide meaningful error messages**: Help users understand what went wrong
3. **Use empty states**: Guide users when no data is available
4. **Keep widgets independent**: Each widget should load separately
5. **Responsive first**: Design for mobile, enhance for desktop
6. **Accessible**: Use semantic HTML and ARIA labels
7. **Type-safe**: Leverage TypeScript for all components
8. **Test thoroughly**: Unit test widgets, integration test dashboards

## Future Enhancements

- [ ] Customizable dashboard layouts (drag-and-drop)
- [ ] Export dashboard to PDF/Excel
- [ ] Real-time updates via WebSockets
- [ ] Dashboard filters and date ranges
- [ ] Widget comparison mode
- [ ] Dark mode optimization
- [ ] Advanced analytics charts
- [ ] Dashboard sharing functionality

## Dependencies

```json
{
  "date-fns": "^3.0.0",
  "@tanstack/react-query": "^5.90.12",
  "@radix-ui/react-progress": "^1.0.0",
  "lucide-react": "^0.562.0"
}
```

## Conclusion

This dashboard implementation provides a robust, scalable, and user-friendly solution for role-based data visualization. The modular architecture allows for easy maintenance and future enhancements.
