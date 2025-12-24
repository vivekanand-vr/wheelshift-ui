# RoleGuard Component

The `RoleGuard` component provides flexible role-based and permission-based access control for your application.

## Features

- ✅ **Role-based access control** - Restrict content by user roles
- ✅ **Permission-based access control** - Restrict content by user permissions
- ✅ **Flexible logic** - Support for "any" or "all" requirement checking
- ✅ **Custom fallbacks** - Show custom content when access is denied
- ✅ **Loading states** - Optional loading indicators during auth checks
- ✅ **Redux integration** - Automatically reads from auth store

## Basic Usage

### Protect by Role

```tsx
import { RoleGuard } from "@/components/common";

// Only show to ADMIN users
<RoleGuard allowedRoles={["ADMIN"]}>
  <AdminPanel />
</RoleGuard>

// Show to multiple roles
<RoleGuard allowedRoles={["ADMIN", "STORE_MANAGER"]}>
  <InventoryView />
</RoleGuard>
```

### Protect by Permission

```tsx
// Only show to users with storage:manage permission
<RoleGuard requiredPermissions={["storage:manage"]}>
  <StorageManager />
</RoleGuard>

// Show to users with any of these permissions
<RoleGuard requiredPermissions={["cars:read", "cars:write"]}>
  <CarsList />
</RoleGuard>
```

### Combined Role and Permission Checks

```tsx
// User needs STORE_MANAGER role OR storage:write permission
<RoleGuard
  allowedRoles={["STORE_MANAGER"]}
  requiredPermissions={["storage:write"]}
  requirementType="any"
>
  <StorageForm />
</RoleGuard>

// User needs ADMIN role AND reports:view permission
<RoleGuard
  allowedRoles={["ADMIN"]}
  requiredPermissions={["reports:view"]}
  requirementType="all"
>
  <FinancialReports />
</RoleGuard>
```

### With Fallback Content

```tsx
<RoleGuard
  allowedRoles={["SUPER_ADMIN"]}
  fallback={
    <div className="p-4 text-center">
      <p className="text-red-500">Access Denied</p>
      <p className="text-sm text-gray-500">
        You need SUPER_ADMIN role to access this content
      </p>
    </div>
  }
>
  <SuperAdminPanel />
</RoleGuard>
```

### With Loading State

```tsx
<RoleGuard
  allowedRoles={["ADMIN"]}
  showLoadingState={true}
  loadingComponent={<Spinner />}
>
  <AdminDashboard />
</RoleGuard>
```

## API Reference

### Props

| Prop                  | Type             | Default                 | Description                                                                      |
| --------------------- | ---------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `allowedRoles`        | `UserRole[]`     | `undefined`             | Array of roles that can access the content                                       |
| `requiredPermissions` | `string[]`       | `undefined`             | Array of permissions required to access the content                              |
| `requirementType`     | `"any" \| "all"` | `"any"`                 | Logic for multiple roles/permissions: "any" = at least one, "all" = all required |
| `children`            | `ReactNode`      | required                | Content to render when authorized                                                |
| `fallback`            | `ReactNode`      | `null`                  | Content to render when not authorized                                            |
| `showLoadingState`    | `boolean`        | `false`                 | Whether to show loading state during auth check                                  |
| `loadingComponent`    | `ReactNode`      | `<div>Loading...</div>` | Custom loading component                                                         |

## Available Roles

Based on your backend schema:

- `SUPER_ADMIN` - Full system control
- `ADMIN` - Manage employees, inventory, inquiries, reservations, sales
- `SALES` - Manage inquiries, reservations, sales
- `INSPECTOR` - Create and update inspections
- `FINANCE` - View/record transactions, financial reports
- `STORE_MANAGER` - Manage storage locations and movements
- `guest` - Unauthenticated users

## Common Use Cases

### Protect Navigation Items

```tsx
import { RoleGuard } from "@/components/common";

export const Sidebar = () => {
  return (
    <nav>
      <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
        <NavItem href="/admin">Admin Panel</NavItem>
      </RoleGuard>

      <RoleGuard
        allowedRoles={["STORE_MANAGER"]}
        requiredPermissions={["storage:read"]}
      >
        <NavItem href="/storage">Storage Management</NavItem>
      </RoleGuard>

      <RoleGuard allowedRoles={["SALES"]}>
        <NavItem href="/sales">Sales Dashboard</NavItem>
      </RoleGuard>
    </nav>
  );
};
```

### Protect Page Content

```tsx
// app/(authenticated)/storage/page.tsx
import { RoleGuard } from "@/components/common";

export default function StoragePage() {
  return (
    <RoleGuard
      allowedRoles={["STORE_MANAGER", "ADMIN"]}
      fallback={<AccessDenied />}
    >
      <div>
        <h1>Storage Management</h1>
        <StorageContent />
      </div>
    </RoleGuard>
  );
}
```

### Protect Actions/Buttons

```tsx
<div>
  <h2>Vehicle Details</h2>

  <RoleGuard requiredPermissions={["cars:write"]}>
    <Button onClick={handleEdit}>Edit</Button>
  </RoleGuard>

  <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
    <Button onClick={handleDelete} variant="destructive">
      Delete
    </Button>
  </RoleGuard>
</div>
```

## Notes

- The component reads authentication state from Redux store (`state.auth`)
- If no restrictions are specified (no roles or permissions), access is granted
- When not authenticated, fallback content is shown
- The component is flexible enough to handle complex authorization scenarios
