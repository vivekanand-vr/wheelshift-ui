# Access Control Feature

**Version:** 1.0
**Last Updated:** January 15, 2026
**Feature Path:** `features/access-control/`

---

## Overview

The Access Control feature provides a comprehensive Role-Based Access Control (RBAC) management interface for Super Admins and Admins to manage roles, permissions, and user access throughout the WheelShift Pro system.

### Key Capabilities

- **Role Management** - Create, edit, and delete system and custom roles
- **Permission Management** - Define and assign fine-grained permissions
- **Employee Role Assignment** - Assign multiple roles to employees
- **Permission-Role Mapping** - Associate permissions with roles
- **System Role Protection** - Prevents accidental deletion of critical roles
- **Real-time Updates** - Immediate reflection of permission changes

---

## Access Requirements

### Allowed Roles

- **SUPER_ADMIN** - Full access to all features including system role management
- **ADMIN** - Access to role assignments and permission viewing

### Feature Protection

The entire feature is wrapped in `RoleGuard` to ensure only authorized users can access it:

```tsx
<RoleGuard
  allowedRoles={["SUPER_ADMIN", "ADMIN"]}
  fallback={<AccessDeniedMessage />}
>
  <AccessControlFeature />
</RoleGuard>
```

---

## Feature Architecture

### Directory Structure

```
features/access-control/
├── api/
│   ├── index.ts                    # Barrel export
│   ├── services.ts                 # API service functions
│   ├── queries.ts                  # React Query hooks
│   └── mutations.ts                # Mutation hooks
├── components/
│   ├── index.ts                    # Barrel export
│   ├── AccessControlFeature.tsx    # Main feature component
│   ├── RoleCard.tsx                # Role display card
│   ├── RoleDialog.tsx              # Role create/edit form
│   ├── PermissionManager.tsx       # Permission assignment UI
│   ├── PermissionDialog.tsx        # Permission creation form
│   └── EmployeeRoleDialog.tsx      # Employee role assignment
├── types/
│   └── index.ts                    # TypeScript interfaces
└── index.ts                        # Feature barrel export
```

---

## API Integration

### Backend Endpoints

All endpoints are prefixed with `/api/v1/rbac`

#### Role Endpoints

- `GET /roles` - Get all roles
- `GET /roles/{id}` - Get role by ID
- `POST /roles` - Create new role (SUPER_ADMIN only)
- `PUT /roles/{id}` - Update role (SUPER_ADMIN only)
- `DELETE /roles/{id}` - Delete role (SUPER_ADMIN only)
- `POST /roles/{roleId}/permissions/{permissionId}` - Add permission to role
- `DELETE /roles/{roleId}/permissions/{permissionId}` - Remove permission from role

#### Permission Endpoints

- `GET /permissions` - Get all permissions
- `GET /permissions/{id}` - Get permission by ID
- `POST /permissions` - Create new permission (SUPER_ADMIN only)
- `PUT /permissions/{id}` - Update permission (SUPER_ADMIN only)
- `DELETE /permissions/{id}` - Delete permission (SUPER_ADMIN only)

#### Employee Role Endpoints

- `GET /employees/{id}/permissions` - Get employee's permissions
- `POST /employees/{id}/roles` - Assign roles to employee

### Service Layer

```typescript
// Example: Get all roles
import { roleService } from "@/features/access-control";

const roles = await roleService.getAllRoles();
```

### React Query Hooks

```typescript
// Query hooks
import {
  useRoles,
  usePermissions,
  useEmployees,
} from "@/features/access-control";

const { data: roles, isLoading } = useRoles();
const { data: permissions } = usePermissions();
const { data: employees } = useEmployees();

// Mutation hooks
import {
  useCreateRole,
  useAddPermissionToRole,
} from "@/features/access-control";

const createRoleMutation = useCreateRole();
const addPermissionMutation = useAddPermissionToRole();
```

---

## Component Usage

### Main Feature Component

```tsx
import { AccessControlFeature } from "@/features/access-control";

export default function AccessControlPage() {
  return <AccessControlFeature />;
}
```

### Role Card

Displays role information with actions:

```tsx
<RoleCard
  role={role}
  onEdit={(role) => console.log("Edit", role)}
  onDelete={(role) => console.log("Delete", role)}
  onManagePermissions={(role) => console.log("Manage", role)}
  isSuperAdmin={true}
/>
```

### Role Dialog

Create or edit roles:

```tsx
<RoleDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => createRole(data)}
  role={selectedRole} // null for create, role object for edit
  isLoading={isLoading}
  isSuperAdmin={true}
/>
```

### Permission Manager

Assign permissions to roles:

```tsx
<PermissionManager
  open={isOpen}
  onClose={() => setIsOpen(false)}
  role={selectedRole}
  availablePermissions={permissions}
  onAddPermission={(roleId, permissionId) =>
    addPermission(roleId, permissionId)
  }
  onRemovePermission={(roleId, permissionId) =>
    removePermission(roleId, permissionId)
  }
  isLoading={isLoading}
/>
```

### Employee Role Dialog

Assign roles to employees:

```tsx
<EmployeeRoleDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  employees={employees}
  roles={roles}
  onAssignRoles={(employeeId, roleIds) => assignRoles(employeeId, roleIds)}
  isLoading={isLoading}
/>
```

---

## Type Definitions

### Core Types

```typescript
export type RoleType =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SALES"
  | "INSPECTOR"
  | "FINANCE"
  | "STORE_MANAGER"
  | string; // Custom roles

export interface Role {
  id: number;
  name: RoleType;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  resource: string;
  action: string;
  name: string; // Format: resource:action
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequest {
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface PermissionRequest {
  resource: string;
  action: string;
  description?: string;
}
```

---

## Features by Tab

### 1. Roles Tab

**Features:**

- ✅ View all roles in grid layout
- ✅ Search roles by name or description
- ✅ Create new roles (SUPER_ADMIN only)
- ✅ Edit existing roles
- ✅ Delete custom roles (SUPER_ADMIN only)
- ✅ Manage role permissions
- ✅ View permission count per role
- ✅ System role protection

**Actions:**

- Create Role (SUPER_ADMIN)
- Edit Role (Admins can edit non-system roles)
- Delete Role (SUPER_ADMIN, non-system only)
- Manage Permissions (All authorized users)

### 2. Permissions Tab

**Features:**

- ✅ View all permissions grouped by resource
- ✅ Search permissions by name or description
- ✅ Create new permissions (SUPER_ADMIN only)
- ✅ View permission details (resource:action format)
- ✅ Permission grouping by resource type

**Permission Format:**

- `resource:action` (e.g., `cars:read`, `employees:write`)
- Wildcard support: `cars:*`, `*:*`

**Available Resources:**

```
cars, car-models, clients, employees, inquiries, reservations,
sales, transactions, inspections, locations, tasks, events,
roles, permissions, acl, notifications
```

**Available Actions:**

```
read, write, delete, * (all actions)
```

### 3. Employees Tab

**Features:**

- ✅ View all employees with assigned roles
- ✅ Search employees by name or email
- ✅ Assign multiple roles to employees
- ✅ View current role assignments
- ✅ Bulk role assignment

**Actions:**

- Assign Roles (Opens employee role dialog)
- View employee role badges

---

## UI/UX Features

### Search & Filter

- Real-time search across all tabs
- Search by name, description, email
- Instant filtering

### View Modes

- Grid View (default) - Card-based layout
- List View - Compact table layout

### Visual Indicators

- System Role badges
- Permission count badges
- Role assignment badges
- Loading skeletons
- Empty states

### Interactions

- Hover effects on cards
- Smooth transitions
- Toast notifications for actions
- Confirmation dialogs for destructive actions

---

## Permission System

### Permission Hierarchy

1. **SUPER_ADMIN Override** - Automatic access to all resources
2. **Role-Based Permissions** - Permissions inherited from assigned roles
3. **Permission Checking** - Wildcard support (`*:*`, `resource:*`)

### System Roles

#### SUPER_ADMIN (ID: 1)

- Permission: `*:*` (all access)
- Cannot be deleted
- Can manage all roles and permissions
- Can edit system roles

#### ADMIN (ID: 2)

- Administrative functions
- Can assign roles to employees
- Can view all permissions
- Cannot delete system roles

#### SALES (ID: 3)

- Sales operations
- Limited to sales-related resources

#### INSPECTOR (ID: 4)

- Vehicle inspections
- Limited to inspection-related resources

#### FINANCE (ID: 5)

- Financial operations
- Limited to financial resources

#### STORE_MANAGER (ID: 6)

- Location management
- Limited to store-related resources

---

## State Management

### React Query Cache

All data is cached using TanStack Query with the following strategy:

```typescript
export const accessControlKeys = {
  all: ["access-control"] as const,
  roles: () => [...accessControlKeys.all, "roles"] as const,
  role: (id: number) => [...accessControlKeys.roles(), id] as const,
  permissions: () => [...accessControlKeys.all, "permissions"] as const,
  employees: () => [...accessControlKeys.all, "employees"] as const,
};
```

**Cache Configuration:**

- Stale Time: 5 minutes
- Auto-refetch on window focus
- Automatic cache invalidation after mutations

### Redux Integration

User authentication state (including role) is stored in Redux:

```typescript
const { user } = useSelector((state: RootState) => state.auth);
const isSuperAdmin = user?.role === "SUPER_ADMIN";
```

---

## Error Handling

### API Errors

All mutations include error handling with user-friendly toast messages:

```typescript
createRoleMutation.mutate(data, {
  onSuccess: () => {
    toast.success("Role created successfully");
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to create role");
  },
});
```

### Validation

- Required field validation in forms
- Role name format validation (uppercase with underscores)
- Duplicate permission prevention
- System role protection

---

## Navigation Integration

The feature is accessible from the sidebar navigation:

```typescript
{
  title: "Access Control",
  href: "/access-control",
  icon: Shield,
  roles: ["SUPER_ADMIN", "ADMIN"],
}
```

Only users with SUPER_ADMIN or ADMIN roles will see this navigation item.

---

## Styling

### Design System

- **Colors:** Primary, secondary, accent, destructive
- **Typography:** Small, medium, h3 variants
- **Spacing:** Consistent 4px grid
- **Shadows:** Subtle elevation on cards
- **Borders:** Rounded corners with border accent

### Dark Mode Support

All components support dark mode through Tailwind's `dark:` variant:

```tsx
className = "bg-accent dark:bg-neutral-800";
```

---

## Performance Optimizations

1. **React Query Caching** - Reduces redundant API calls
2. **Lazy Loading** - Dialog components only render when open
3. **Debounced Search** - Prevents excessive filtering
4. **Memoization** - Filtered data is computed efficiently
5. **Optimistic Updates** - UI updates before API confirmation

---

## Testing Considerations

### Unit Tests

Test individual components:

```typescript
describe("RoleCard", () => {
  it("renders role information correctly", () => {});
  it("calls onEdit when edit is clicked", () => {});
  it("disables delete for system roles", () => {});
});
```

### Integration Tests

Test API integration:

```typescript
describe("Access Control API", () => {
  it("fetches roles successfully", async () => {});
  it("creates a new role", async () => {});
  it("assigns permissions to role", async () => {});
});
```

### E2E Tests

Test complete workflows:

```typescript
describe("Access Control Feature", () => {
  it("allows super admin to create a role", () => {});
  it("prevents admin from deleting system roles", () => {});
  it("allows assigning roles to employees", () => {});
});
```

---

## Known Limitations

1. **Single Role per Employee** - Backend currently supports multiple roles, but some legacy code assumes single role
2. **Permission Wildcards** - Limited to `resource:*` and `*:*` patterns
3. **No Permission Inheritance** - Permissions must be explicitly assigned
4. **No Role Hierarchy** - Flat role structure (no parent-child relationships)

---

## Future Enhancements

- [ ] Role hierarchy (parent-child roles)
- [ ] Permission inheritance
- [ ] Bulk role assignment
- [ ] Role templates
- [ ] Permission search and autocomplete
- [ ] Audit log for role/permission changes
- [ ] Export/import role configurations
- [ ] Role analytics and usage statistics

---

## Troubleshooting

### Common Issues

**Issue:** "Access Denied" message appears
**Solution:** Ensure user has SUPER_ADMIN or ADMIN role

**Issue:** Cannot delete a role
**Solution:** System roles cannot be deleted. Only custom roles (isSystem: false) can be deleted, and only by SUPER_ADMIN

**Issue:** Permissions not updating immediately
**Solution:** React Query cache may be stale. Wait 5 minutes or refresh the page

**Issue:** Employee not showing assigned roles
**Solution:** Ensure the employee data includes the `roles` relationship from the backend

---

## API Reference Summary

### Base URL

```
http://localhost:8080/api/v1/rbac
```

### Authentication

All requests require Bearer token in Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Example Requests

**Create Role:**

```bash
POST /api/v1/rbac/roles
{
  "name": "INVENTORY_MANAGER",
  "description": "Manages inventory and stock",
  "isSystem": false
}
```

**Add Permission to Role:**

```bash
POST /api/v1/rbac/roles/7/permissions/15
```

**Assign Roles to Employee:**

```bash
POST /api/v1/employees/5/roles
{
  "roleIds": [3, 6]
}
```

**Create Permission:**

```bash
POST /api/v1/rbac/permissions
{
  "resource": "inventory",
  "action": "audit",
  "description": "Perform inventory audits"
}
```

---

## Related Documentation

- [RBAC Implementation Summary](d:/INDPRO Projects/WheelShiftPro/docs/rbac/RBAC_IMPLEMENTATION_SUMMARY.md)
- [RBAC Usage Guide](d:/INDPRO Projects/WheelShiftPro/docs/rbac/RBAC_USAGE_GUIDE.md)
- [RoleGuard Component](../roleGuard/README.md)
- [File Structure Guide](../../FILE_STRUCTURE.md)

---

## Support

For issues or questions about the Access Control feature:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [RBAC Usage Guide](d:/INDPRO Projects/WheelShiftPro/docs/rbac/RBAC_USAGE_GUIDE.md)
3. Check Swagger API documentation at `http://localhost:8080/swagger-ui/index.html#/`
4. Contact the development team

---

**Last Updated:** January 15, 2026
**Maintained by:** WheelShift Pro Development Team
