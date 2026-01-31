# RoleGuard Component

The `RoleGuard` component provides flexible role-based and permission-based access control for your application.

## Features

- ✅ **Role-based access control** - Restrict content by user roles
- ✅ **Permission-based access control** - Restrict content by user permissions
- ✅ **Smart default behavior** - Hides unauthorized content by default (no broken layouts)
- ✅ **Flexible logic** - Support for "any" or "all" requirement checking
- ✅ **Custom fallbacks** - Show custom content when access is denied
- ✅ **Full page protection** - Optional 403 error page for full-page guards
- ✅ **Loading states** - Optional loading indicators during auth checks
- ✅ **Redux integration** - Automatically reads from auth store

## How It Works

### Default Behavior: Hide Unauthorized Content

By default, `RoleGuard` **hides** unauthorized content by returning `null`. This is perfect for:

- Buttons and action items
- Navigation links
- Dropdown menu items
- UI components within cards or forms

**Result**: Clean UI without broken layouts or error messages in unexpected places.

### Custom Fallbacks

You can show alternative content when access is denied:

```tsx
<RoleGuard allowedRoles={["ADMIN"]} fallback={<DisabledButton />}>
  <EditButton />
</RoleGuard>
```

### Full Page Protection

For full-page content, use `showErrorPage={true}` to display a 403 error page:

```tsx
<RoleGuard allowedRoles={["ADMIN"]} showErrorPage={true}>
  <AdminDashboard />
</RoleGuard>
```

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
| `fallback`            | `ReactNode`      | `null`                  | Content to render when not authorized. If not provided, content is hidden        |
| `showErrorPage`       | `boolean`        | `false`                 | Show 403 error page when not authorized. Use for full-page protection            |
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
- `USER` - Regular Users

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
      showErrorPage={true} // Show 403 error page for full-page protection
    >
      <div>
        <h1>Storage Management</h1>
        <StorageContent />
      </div>
    </RoleGuard>
  );
}

// Or with custom fallback
export default function StoragePageAlt() {
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

  {/* Button is hidden for unauthorized users - clean UI */}
  <RoleGuard requiredPermissions={["cars:write"]}>
    <Button onClick={handleEdit}>Edit</Button>
  </RoleGuard>

  {/* Button is hidden for non-admins */}
  <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
    <Button onClick={handleDelete} variant="destructive">
      Delete
    </Button>
  </RoleGuard>

  {/* Show disabled button instead of hiding */}
  <RoleGuard
    requiredPermissions={["cars:write"]}
    fallback={<Button disabled>Edit (No Permission)</Button>}
  >
    <Button onClick={handleEdit}>Edit</Button>
  </RoleGuard>
</div>
```

### Protect Dropdown Menu Items

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* These menu items are hidden for unauthorized users */}
    <RoleGuard requiredPermissions={["cars:write"]}>
      <DropdownMenuItem>Edit</DropdownMenuItem>
    </RoleGuard>

    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </RoleGuard>
  </DropdownMenuContent>
</DropdownMenu>
```

## When to Use What

### ✅ Default (Hidden) - Best for UI Components

Use the default behavior (no `fallback` or `showErrorPage`) when protecting:

- Buttons
- Menu items
- Navigation links
- Cards or sections within a page
- Action items in toolbars

**Why**: Keeps the UI clean without gaps or error messages in unexpected places.

```tsx
<RoleGuard allowedRoles={["ADMIN"]}>
  <DeleteButton />
</RoleGuard>
```

### 🔄 Custom Fallback - Show Alternative Content

Use `fallback` when you want to show alternative content:

- Disabled buttons with explanation
- "Upgrade to access" messages
- Alternative UI for non-authorized users

```tsx
<RoleGuard
  allowedRoles={["ADMIN"]}
  fallback={
    <Button disabled tooltip="Admin only">
      Edit
    </Button>
  }
>
  <Button onClick={handleEdit}>Edit</Button>
</RoleGuard>
```

### 🚫 Error Page - Full Page Protection

Use `showErrorPage={true}` for:

- Full page content
- Entire route protection
- When you want to explicitly tell users they don't have access

```tsx
<RoleGuard allowedRoles={["ADMIN"]} showErrorPage={true}>
  <AdminDashboard />
</RoleGuard>
```

## Notes

- The component reads authentication state from Redux store (`state.auth`)
- **Default behavior**: Unauthorized content is **hidden** (returns `null`) - perfect for buttons, menus, and UI components
- Use `showErrorPage={true}` for full-page protection to show 403 error page
- Use `fallback` prop to show custom content when access is denied
- If no restrictions are specified (no roles or permissions), access is granted
- The component is flexible enough to handle complex authorization scenarios
- Priority order: `fallback` (if provided) → `showErrorPage` (if true) → hide content (default)
