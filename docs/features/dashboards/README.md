# Dashboard Feature Documentation

## Overview

The Dashboard feature provides role-based, personalized dashboards for different user types in the WheelShift Pro application. Each dashboard displays relevant metrics, statistics, and actionable insights tailored to the user's role and responsibilities.

## Supported Roles

### 1. Admin Dashboard

**Users**: ADMIN, SUPER_ADMIN

**Widgets**:

- Overview Statistics (cars, employees, sales)
- Revenue Metrics (total, monthly, YTD, average)
- Inventory Health (by status, aging analysis)
- Top Performers (employee leaderboard)
- Recent Activities (timeline)
- System Alerts (reservations, inspections, capacity)
- Notifications (unread count, recent items)

**Use Cases**:

- Monitor overall business performance
- Track employee productivity
- Identify system issues
- Review financial metrics

### 2. Sales Dashboard

**Users**: SALES

**Widgets**:

- Personal Statistics (inquiries, conversions, commission)
- Sales Pipeline (inquiries by status, follow-ups)
- Performance Metrics (target progress, average sale value)
- Quick Actions (pending responses, expiring reservations)
- Available Inventory (cars ready to sell)
- Notifications (personal alerts)

**Use Cases**:

- Track personal sales performance
- Manage customer inquiries
- Monitor sales pipeline
- View available inventory

### 3. Inspector Dashboard

**Users**: INSPECTOR

**Widgets**:

- Inspection Queue (pending, scheduled, overdue)
- Personal Statistics (completions, pass rate, avg time)
- Vehicle Status (needing inspection, failed, in maintenance)
- Assigned Tasks (total, high priority, due today)
- Location Summary (inspections by location)
- Recent Inspections (completed work)
- Notifications (inspection alerts)

**Use Cases**:

- Manage inspection workload
- Track inspection performance
- Identify overdue inspections
- Monitor vehicle status

### 4. Finance Dashboard

**Users**: FINANCE

**Widgets**:

- Financial Overview (revenue, expenses, profit, margin)
- Transaction Summary (pending, completed, amounts)
- Profitability Analysis (per vehicle, margins)
- Aging Analysis (overdue payments, pending deposits)
- Budget Tracking (utilization by category)
- Notifications (finance alerts)

**Use Cases**:

- Monitor financial health
- Track transactions
- Analyze profitability
- Manage budget

### 5. Store Manager Dashboard

**Users**: STORE_MANAGER

**Widgets**:

- Location Overview (locations, capacity, utilization)
- Vehicle Distribution (by location and status)
- Movement Activity (daily and weekly transfers)
- Capacity Alerts (near full, underutilized)
- Maintenance Status (vehicles in service)
- Performance Metrics (turnover, stay duration)
- Notifications (location alerts)

**Use Cases**:

- Manage location capacity
- Track vehicle movements
- Monitor maintenance
- Optimize space utilization

## Features

### 🎨 Visual Design

- **Clean and Modern**: Minimalist design with clear hierarchy
- **Responsive**: Fully responsive on mobile, tablet, and desktop
- **Dark Mode**: Supports light and dark themes
- **Consistent**: Uses shadcn/ui component library

### ⚡ Performance

- **Fast Loading**: Shimmer effects for perceived performance
- **Auto-Refresh**: Data updates every 5 minutes
- **Caching**: 5-minute cache to reduce API calls
- **Independent Widgets**: Each widget loads separately

### 🔒 Security

- **Role-Based Access**: Only shows data user is authorized to see
- **API Authentication**: All requests require valid JWT token
- **Data Scoping**: Respects organizational data boundaries

### 🎯 User Experience

- **Loading States**: Shimmer skeletons during data fetch
- **Error Handling**: Clear error messages with retry option
- **Empty States**: Helpful messages when no data available
- **Responsive**: Optimized for all screen sizes

## Usage

### Basic Implementation

```tsx
import { DashboardContainer } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardContainer />;
}
```

### With Custom Layout

```tsx
import { DashboardContainer } from "@/features/dashboard";
import { PageHeader, Container } from "@/components/common";

export default function DashboardPage() {
  return (
    <Container>
      <PageHeader title="Dashboard" description="Your personalized overview" />
      <DashboardContainer />
    </Container>
  );
}
```

### Role-Specific Dashboard

```tsx
import { AdminDashboard } from "@/features/dashboard";

export default function AdminPage() {
  const { data, isLoading } = useDashboard("ADMIN");

  if (isLoading) return <DashboardSkeleton />;

  return <AdminDashboard data={data} />;
}
```

## API Endpoints

### Get Current User Dashboard

```
GET /api/v1/dashboard/me
```

Auto-detects user role and returns appropriate dashboard.

### Role-Specific Endpoints

```
GET /api/v1/dashboard/admin
GET /api/v1/dashboard/sales
GET /api/v1/dashboard/inspector
GET /api/v1/dashboard/finance
GET /api/v1/dashboard/store-manager
```

## Components

### DashboardContainer

Main container that handles routing and state management.

**Props**: None (uses current user from auth context)

### StatCard

Reusable card for displaying single metrics.

**Props**:

- `title`: Metric label
- `value`: Metric value (number or string)
- `description`: Optional subtitle
- `icon`: Optional Lucide icon
- `trend`: Optional trend data

### NotificationsWidget

Displays recent notifications with unread count.

**Props**:

- `data`: NotificationsWidget object

### RecentActivitiesWidget

Timeline of recent system activities.

**Props**:

- `activities`: Array of ActivityLog

### RevenueChartWidget

Bar chart visualization of revenue trends.

**Props**:

- `data`: RevenueMetrics object

### AlertsWidget

System alerts and warnings display.

**Props**:

- `data`: SystemAlerts object

## Customization

### Adding a New Widget

1. Create widget component in `features/dashboard/components/widgets/`
2. Import in dashboard layout
3. Pass required data props
4. Handle loading, error, and empty states

Example:

```tsx
// CustomWidget.tsx
export const CustomWidget = ({ data }) => {
  if (!data) return <WidgetEmpty />;

  return (
    <Card className="p-6">
      <h3>{data.title}</h3>
      <p>{data.value}</p>
    </Card>
  );
};
```

### Modifying Dashboard Layout

Edit the role-specific dashboard component:

```tsx
// features/dashboard/components/dashboards/AdminDashboard.tsx
export const AdminDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Add or remove widget sections */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard {...} />
        <CustomWidget {...} />
      </div>
    </div>
  );
};
```

## Styling

### Responsive Breakpoints

```tsx
// Mobile-first approach
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Widgets */}</div>
```

- **Mobile** (default): 1 column
- **Tablet** (md): 2 columns
- **Desktop** (lg): 4 columns

### Color Palette

```tsx
// Success metrics
className = "bg-green-500/10 border-green-500/20";

// Warning alerts
className = "bg-warning/10 border-warning/20";

// Error states
className = "bg-destructive/10 border-destructive/20";

// Info/Primary
className = "bg-primary/10 border-primary/20";
```

## Error Handling

### Network Errors

```tsx
<WidgetError
  title="Connection Error"
  message="Unable to connect to server"
  onRetry={() => refetch()}
/>
```

### Permission Errors

```tsx
<WidgetError
  title="Access Denied"
  message="You don't have permission to view this data"
/>
```

### Data Errors

```tsx
<WidgetEmpty
  title="No Data Available"
  message="Data will appear once available"
/>
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Sufficient color contrast
- ✅ Focus indicators

## Performance Tips

1. **Use React Query**: Automatic caching and refetching
2. **Lazy Load**: Load dashboards on demand
3. **Memoize**: Use React.memo for expensive components
4. **Virtualize**: Use virtual scrolling for long lists
5. **Optimize Images**: Use Next.js Image component

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

test('renders stat card', () => {
  render(<StatCard title="Test" value={100} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
import { render } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';

test('renders admin dashboard', () => {
  const mockData = { /* mock data */ };
  render(<AdminDashboard data={mockData} />);
  // Assertions
});
```

## FAQ

**Q: How do I add a new role?**
A: Create a new dashboard component, add it to DashboardContainer routing, and create corresponding API endpoint.

**Q: Can I customize the refresh interval?**
A: Yes, modify the `refetchInterval` in `useDashboard` hook.

**Q: How do I add real-time updates?**
A: Integrate WebSocket connection and invalidate React Query cache on updates.

**Q: Can users customize their dashboard?**
A: Not yet, but this is planned for future releases.

## Changelog

### Version 1.0.0 (2025-12-23)

- ✨ Initial dashboard implementation
- ✅ 5 role-specific dashboards
- ✅ 8+ reusable widgets
- ✅ Loading, error, and empty states
- ✅ Responsive design
- ✅ Auto-refresh functionality
- ✅ React Query integration
- ✅ TypeScript type safety

## Support

For issues or questions:

- Create an issue in the project repository
- Contact the development team
- Check the implementation guide for detailed examples

## License

Internal use only - WheelShift Pro
