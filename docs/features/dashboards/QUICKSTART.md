# Dashboard Quick Start Guide

Get your dashboard up and running in 5 minutes!

## Installation

### 1. Install Dependencies

```bash
npm install date-fns @radix-ui/react-progress
```

### 2. Verify Required Packages

Ensure these are in your `package.json`:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.12",
    "lucide-react": "^0.562.0",
    "date-fns": "^3.0.0",
    "@radix-ui/react-progress": "^1.0.0"
  }
}
```

## Basic Setup

### 1. Import and Use

```tsx
// app/(authenticated)/dashboard/page.tsx
"use client";

import { DashboardContainer } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardContainer />;
}
```

That's it! The dashboard will:

- ✅ Auto-detect user role from authentication
- ✅ Fetch appropriate dashboard data
- ✅ Display loading states
- ✅ Handle errors gracefully
- ✅ Refresh data every 5 minutes

## Usage Examples

### Basic Dashboard

```tsx
import { DashboardContainer } from "@/features/dashboard";

export default function Page() {
  return <DashboardContainer />;
}
```

### With Page Layout

```tsx
import { DashboardContainer } from "@/features/dashboard";
import { Container, PageHeader } from "@/components/common";

export default function Page() {
  return (
    <Container>
      <PageHeader title="Dashboard" description="Your personalized overview" />
      <DashboardContainer />
    </Container>
  );
}
```

### Specific Role Dashboard

```tsx
import { AdminDashboard, useDashboard } from "@/features/dashboard";

export default function AdminPage() {
  const { data, isLoading } = useDashboard("ADMIN");

  if (isLoading) return <div>Loading...</div>;

  return <AdminDashboard data={data} />;
}
```

## API Configuration

### Configure Axios Instance

Ensure your axios instance is configured:

```typescript
// lib/api/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Component Examples

### Using Individual Widgets

```tsx
import {
  StatCard,
  NotificationsWidget,
  RecentActivitiesWidget,
} from "@/features/dashboard";

export default function CustomDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Sales" value={150} icon={DollarSign} />
      </div>

      <NotificationsWidget data={notifications} />
      <RecentActivitiesWidget activities={activities} />
    </div>
  );
}
```

### Custom Loading State

```tsx
import { StatCardSkeleton } from "@/features/dashboard";

export default function Loading() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Custom Error Handling

```tsx
import { WidgetError } from "@/features/dashboard";

export default function Error() {
  return (
    <WidgetError
      title="Failed to Load"
      message="Unable to fetch dashboard data"
      onRetry={() => window.location.reload()}
    />
  );
}
```

## Customization

### Change Refresh Interval

```typescript
// features/dashboard/hooks/index.ts
export const useDashboard = (role?: DashboardRole) => {
  return useQuery({
    queryKey: ["dashboard", role || "current"],
    queryFn: () => fetchDashboardData(role),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });
};
```

### Add Custom Widget

```tsx
// features/dashboard/components/widgets/CustomWidget.tsx
import { Card } from "@/components/ui/card";

export const CustomWidget = ({ data }) => {
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Custom Metric</h3>
      <p className="text-3xl font-bold">{data.value}</p>
    </Card>
  );
};
```

### Modify Dashboard Layout

```tsx
// features/dashboard/components/dashboards/AdminDashboard.tsx
export const AdminDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Add your custom section */}
      <div className="grid gap-4 md:grid-cols-3">
        <CustomWidget data={data.custom} />
      </div>

      {/* Existing widgets */}
      <StatCard {...} />
    </div>
  );
};
```

## Styling

### Default Theme

The dashboard uses your app's theme automatically:

```tsx
// Supports light and dark mode
<Card className="bg-background text-foreground p-6">{/* Content */}</Card>
```

### Custom Colors

```tsx
<StatCard
  title="Revenue"
  value="$50,000"
  iconClassName="bg-green-500/10 text-green-600"
/>
```

### Responsive Grid

```tsx
<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Widgets adjust automatically */}
</div>
```

## Common Tasks

### Add Real-Time Updates

```typescript
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  // Invalidate cache when event occurs
  const handleUpdate = () => {
    queryClient.invalidateQueries(["dashboard"]);
  };

  // Setup WebSocket or polling
  useEffect(() => {
    // Your real-time logic
  }, []);
}
```

### Export Dashboard Data

```typescript
import jsPDF from "jspdf";

export function exportDashboard(data: DashboardResponse) {
  const pdf = new jsPDF();
  // Add dashboard data to PDF
  pdf.save("dashboard.pdf");
}
```

### Filter Dashboard Data

```typescript
export const useDashboard = (role?: DashboardRole, filters?: Filters) => {
  return useQuery({
    queryKey: ["dashboard", role, filters],
    queryFn: () => dashboardApi.getDashboard(role, filters),
  });
};
```

## Troubleshooting

### Issue: Dashboard not loading

**Check**:

1. User is authenticated
2. API endpoint is correct
3. User has required role permissions

```tsx
// Debug mode
console.log("User role:", userRole);
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
```

### Issue: Widgets showing errors

**Solution**: Wrap in error boundary

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<WidgetError />}>
  <DashboardContainer />
</ErrorBoundary>;
```

### Issue: Performance issues

**Solution**: Optimize with React.memo

```tsx
export const StatCard = React.memo(({ title, value }) => {
  return <Card>{/* ... */}</Card>;
});
```

## Testing

### Test Dashboard Rendering

```typescript
import { render, screen } from '@testing-library/react';
import { DashboardContainer } from '@/features/dashboard';

test('renders dashboard', async () => {
  render(<DashboardContainer />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### Mock Dashboard Data

```typescript
const mockAdminData = {
  overview: {
    totalCars: 150,
    availableCars: 100,
    // ...
  },
  // ...
};

render(<AdminDashboard data={mockAdminData} />);
```

## Next Steps

1. ✅ Dashboard is working
2. 🎨 Customize colors and styling
3. 📊 Add custom widgets
4. 🔄 Setup real-time updates
5. 📱 Test on mobile devices
6. 🧪 Write tests
7. 🚀 Deploy to production

## Resources

- [Full Implementation Guide](./IMPLEMENTATION.md)
- [API Documentation](./API.md)
- [Component Reference](./COMPONENTS.md)

## Support

Need help? Check:

- Implementation documentation
- Component examples
- API reference
- Contact development team

---

**Ready to customize?** Check out the [Implementation Guide](./IMPLEMENTATION.md) for advanced usage!
