# Error Components

Comprehensive error pages and error handling components for the WheelShiftPro application.

## Components

### Error Pages

All error pages are styled consistently with:

- Large error code display
- Icon with color-coded background
- Clear title and description
- Action buttons (back, home, retry, etc.)
- Fully customizable props
- Responsive design
- Dark mode support

#### Error401 - Unauthorized

**Use Case**: User needs to authenticate

```tsx
import { Error401 } from "@/components/error";

<Error401
  title="Authentication Required"
  description="You need to be logged in to access this resource."
  showLoginButton={true}
/>;
```

**Props**:

- `title?: string` - Custom title (default: "Authentication Required")
- `description?: string` - Custom description
- `showLoginButton?: boolean` - Show login button (default: true)
- `showHomeButton?: boolean` - Show home button (default: false)
- `customAction?: { label: string; onClick: () => void }` - Custom action

---

#### Error403 - Forbidden

**Use Case**: User doesn't have permission (Used as default in RoleGuard)

```tsx
import { Error403 } from "@/components/error";

<Error403
  title="Access Denied"
  description="You don't have permission to access this resource."
/>;
```

**Props**:

- `title?: string` - Custom title (default: "Access Denied")
- `description?: string` - Custom description
- `showBackButton?: boolean` - Show back button (default: true)
- `showHomeButton?: boolean` - Show home button (default: true)
- `customAction?: { label: string; onClick: () => void }` - Custom action

**RoleGuard Integration**:

```tsx
// Error403 is now the default fallback
<RoleGuard allowedRoles={["ADMIN"]}>
  <AdminPanel />
</RoleGuard>

// Or with custom fallback
<RoleGuard
  allowedRoles={["ADMIN"]}
  fallback={<CustomAccessDenied />}
>
  <AdminPanel />
</RoleGuard>
```

---

#### Error404 - Not Found

**Use Case**: Page or resource doesn't exist

```tsx
import { Error404 } from "@/components/error";

<Error404
  title="Page Not Found"
  description="The page you're looking for doesn't exist."
/>;
```

**Props**:

- `title?: string` - Custom title (default: "Page Not Found")
- `description?: string` - Custom description
- `showBackButton?: boolean` - Show back button (default: true)
- `showHomeButton?: boolean` - Show home button (default: true)
- `customAction?: { label: string; onClick: () => void }` - Custom action

**Next.js Integration**:
The global `app/not-found.tsx` uses this component automatically.

---

#### Error500 - Internal Server Error

**Use Case**: Server-side errors

```tsx
import { Error500 } from "@/components/error";

<Error500
  title="Server Error"
  description="Something went wrong on our end."
  onRetry={() => refetchData()}
/>;
```

**Props**:

- `title?: string` - Custom title (default: "Server Error")
- `description?: string` - Custom description
- `showRetryButton?: boolean` - Show retry button (default: true)
- `showHomeButton?: boolean` - Show home button (default: true)
- `onRetry?: () => void` - Retry callback
- `customAction?: { label: string; onClick: () => void }` - Custom action

**Next.js Integration**:
The global `app/error.tsx` uses this component for unhandled errors.

---

#### Error503 - Service Unavailable

**Use Case**: Maintenance or service downtime

```tsx
import { Error503 } from "@/components/error";

<Error503
  title="Under Maintenance"
  description="We're performing scheduled maintenance."
  estimatedTime="30 minutes"
/>;
```

**Props**:

- `title?: string` - Custom title (default: "Service Unavailable")
- `description?: string` - Custom description
- `showRetryButton?: boolean` - Show retry button (default: true)
- `onRetry?: () => void` - Retry callback
- `estimatedTime?: string` - Estimated downtime

---

### ErrorBoundary

**Use Case**: Catch JavaScript errors in component tree

```tsx
import { ErrorBoundary } from "@/components/error";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

**With Custom Fallback**:

```tsx
<ErrorBoundary fallback={<CustomErrorPage />}>
  <YourComponent />
</ErrorBoundary>
```

**Props**:

- `children: ReactNode` - Components to protect
- `fallback?: ReactNode` - Custom fallback UI (default: Error500)

**Features**:

- Catches JavaScript errors anywhere in child tree
- Prevents app crash
- Logs errors to console (can be extended to error reporting service)
- Provides retry functionality

---

## File Structure

```
components/error/
├── 401.tsx           # Unauthorized error page
├── 403.tsx           # Forbidden error page
├── 404.tsx           # Not Found error page
├── 500.tsx           # Internal Server Error page
├── 503.tsx           # Service Unavailable page
├── ErrorBoundary.tsx # Error boundary component
└── index.ts          # Exports

app/
├── not-found.tsx     # Global 404 page
└── error.tsx         # Global error handler
```

## Usage Examples

### In Pages

```tsx
// Direct usage in a page
import { Error403 } from "@/components/error";

export default function UnauthorizedPage() {
  return <Error403 />;
}
```

### With API Calls

```tsx
import { Error500 } from "@/components/error";

const MyComponent = () => {
  const { data, error, refetch } = useQuery("data", fetchData);

  if (error) {
    return (
      <Error500
        title="Failed to Load Data"
        description="We couldn't fetch the data. Please try again."
        onRetry={refetch}
      />
    );
  }

  return <div>{data}</div>;
};
```

### With RoleGuard (Default)

```tsx
import { RoleGuard } from "@/components/common/RoleGuard";

// Error403 is shown automatically when access is denied
<RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
  <SettingsPanel />
</RoleGuard>;
```

### With ErrorBoundary

```tsx
import { ErrorBoundary } from "@/components/error";

export default function Layout({ children }) {
  return (
    <ErrorBoundary>
      <main>{children}</main>
    </ErrorBoundary>
  );
}
```

### With Custom Actions

```tsx
<Error403
  title="Team Access Required"
  description="You need to be part of a team to access this feature."
  customAction={{
    label: "Join a Team",
    onClick: () => router.push("/teams/join"),
  }}
/>
```

### Conditional Error Display

```tsx
const MyComponent = () => {
  const [errorType, setErrorType] = useState<number | null>(null);

  if (errorType === 403) return <Error403 />;
  if (errorType === 404) return <Error404 />;
  if (errorType === 500) return <Error500 />;

  return <div>Content</div>;
};
```

## Styling

All error pages use:

- **Tailwind CSS** for styling
- **Lucide React** icons
- **shadcn/ui** Button component
- Consistent color coding:
  - 401 (Yellow) - Authentication
  - 403 (Red) - Permission denied
  - 404 (Blue) - Not found
  - 500 (Orange) - Server error
  - 503 (Purple) - Service unavailable

## Customization

### Changing Default Colors

Edit the respective error component file:

```tsx
// In 403.tsx
<div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
  <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
</div>
```

### Adding New Error Pages

1. Create new file in `components/error/`
2. Follow the existing pattern
3. Export in `index.ts`

Example:

```tsx
// 429.tsx - Rate Limit
export const Error429 = ({ title, description }: Error429Props) => {
  // Follow pattern from other error pages
};
```

## Integration with Backend

These error pages work seamlessly with the backend error responses:

```tsx
// Axios interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Redirect to login or show Error401
    } else if (status === 403) {
      // RoleGuard shows Error403 automatically
    } else if (status === 404) {
      // Show Error404
    } else if (status === 500) {
      // Show Error500
    }

    return Promise.reject(error);
  }
);
```

## Accessibility

All error pages include:

- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly content
- Focus management on action buttons

## Testing

```tsx
// Test error pages
describe("Error403", () => {
  it("renders with default props", () => {
    render(<Error403 />);
    expect(screen.getByText("403")).toBeInTheDocument();
  });

  it("calls custom action", () => {
    const onClick = jest.fn();
    render(<Error403 customAction={{ label: "Action", onClick }} />);
    fireEvent.click(screen.getByText("Action"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Use appropriate error page** for each scenario
2. **Provide clear descriptions** of what went wrong
3. **Offer actionable solutions** (buttons, links)
4. **Log errors** for debugging (in ErrorBoundary)
5. **Test error states** in your components
6. **Customize messages** for better UX

## Related Documentation

- [RoleGuard Documentation](../common/RoleGuard.tsx)
- [Auth System](../../features/auth/README.md)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

_Last updated: January 17, 2026_
