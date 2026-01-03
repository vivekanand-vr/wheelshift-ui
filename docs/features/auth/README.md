# Authentication Feature

## 📋 Overview

The authentication feature handles user login, logout, and session management. It follows the standard feature architecture pattern with clear separation of concerns.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN PAGE (app/login/page.tsx)            │
│  Renders the LoginFeature component                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOGINFEATURE COMPONENT                                         │
│  Main container, includes LoginForm                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOGINFORM COMPONENT                                            │
│  • Renders email/password form                                  │
│  • Validates input with Zod schema                              │
│  • Calls useAuth hook for login                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  USEAUTH HOOK                                                   │
│  • Contains ALL authentication logic                            │
│  • Calls login/logout mutations                                 │
│  • Updates Redux store                                          │
│  • Handles navigation                                           │
│  • Shows toast notifications                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  MUTATIONS (useLoginMutation, useLogoutMutation)                │
│  • React Query mutation configurations                          │
│  • Calls authApi services                                       │
│  • Returns data or errors                                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICES (authApi)                                             │
│  • authApi.login() - POST /auth/login                           │
│  • authApi.logout() - POST /auth/logout                         │
│  • authApi.getCurrentUser() - GET /auth/me                      │
│  • Pure HTTP calls using Axios                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
└─────────────────────────────────────────────────────────────────┘

                 ┌────────────────────────┐
                 │    REDUX STORE         │
                 │  (Global Auth State)   │
                 │                        │
                 │  • user                │
                 │  • isAuthenticated     │
                 │  • isLoading           │
                 │  • error               │
                 │                        │
                 │  Persisted to          │
                 │  localStorage          │
                 └────────────────────────┘
```

## 📁 Folder Structure

```
features/auth/
├── api/
│   ├── services.ts          # Pure API calls (login, logout, getCurrentUser)
│   ├── mutations.ts         # React Query mutations (useLoginMutation, useLogoutMutation)
│   ├── queries.ts           # React Query queries (checkAuth)
│   └── index.ts             # Exports all API-related items
│
├── components/
│   ├── LoginFeature.tsx     # Main feature container
│   ├── LoginForm.tsx        # Login form UI
│   └── index.ts             # Component exports
│
├── hooks/
│   ├── useAuth.ts           # Main auth hook (all logic)
│   └── index.ts             # Hook exports
│
├── store/
│   ├── authSlice.ts         # Redux slice (user state, async thunks)
│   └── index.ts             # Store exports
│
├── types/
│   └── index.ts             # Auth-specific types (User, LoginCredentials, etc.)
│
└── index.ts                 # Main feature exports
```

## 🔄 How It Works

### Login Flow

1. **User enters credentials** in LoginForm component
2. **Form validation** occurs using Zod schema
3. **LoginForm calls** `useAuth().login()`
4. **useAuth hook:**
   - Calls `loginMutation.mutateAsync()`
   - On success: Updates Redux store with user data
   - Shows success toast
   - Navigates to dashboard
   - On error: Shows error toast and updates error state
5. **loginMutation:**
   - Calls `authApi.login()` service
   - Returns user data or throws error
6. **authApi.login():**
   - Makes POST request to `/auth/login`
   - Returns user data from backend
7. **Redux store updated:**
   - User data stored
   - `isAuthenticated` set to true
   - State persisted to localStorage

### Logout Flow

1. **User clicks logout** (from header/menu)
2. **Component calls** `useAuth().logout()`
3. **useAuth hook:**
   - Calls `logoutMutation.mutateAsync()`
   - Clears Redux store
   - Removes localStorage data
   - Shows success toast
   - Navigates to login page
4. **logoutMutation:**
   - Calls `authApi.logout()` service
5. **authApi.logout():**
   - Makes POST request to `/auth/logout`
   - Clears server-side session

### Session Check Flow

1. **App loads** or page refreshes
2. **Auth guard** calls `useAuth().checkAuth()`
3. **useAuth hook:**
   - Dispatches `checkAuthAsync` thunk
4. **checkAuthAsync thunk:**
   - Calls `authApi.getCurrentUser()`
   - Returns user data if authenticated
   - Throws error if not authenticated
5. **Redux store updated:**
   - If valid: User data loaded, `isAuthenticated` = true
   - If invalid: Store cleared, redirect to login

## 🎯 Key Components

### LoginForm

- Renders email and password inputs
- Validates form with Zod schema
- Displays loading state during login
- Shows error messages from form or API
- Simple UI component with no business logic

### useAuth Hook

- **Single source of truth** for all auth logic
- Provides: `login()`, `logout()`, `checkAuth()`, `clearError()`
- Provides state: `user`, `isAuthenticated`, `isLoading`, `error`
- Handles all side effects (navigation, toasts, state updates)
- Used by any component that needs auth functionality

### Redux Store (authSlice)

- Stores global auth state
- Persisted to localStorage for session continuity
- Updated by useAuth hook
- Read by components and guards
- Contains async thunks for login/logout/checkAuth

## 🔐 Role-Based Access

After login, user roles are mapped from backend:

```
Backend Roles       →    Frontend Role
──────────────────      ─────────────────
["SUPER_ADMIN"]     →    SUPER_ADMIN
["ADMIN"]           →    ADMIN
["SALES"]           →    SALES
["INSPECTOR"]       →    INSPECTOR
["FINANCE"]         →    FINANCE
["STORE_MANAGER"]   →    STORE_MANAGER
Other               →    USER
```

Protected pages wrap features in RoleGuard:

```
app/admin/page.tsx
    │
    └─→ RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}
            │
            └─→ AdminDashboard (only shown to allowed roles)
```

## 📊 State Management

### Redux Store State

```
{
  user: {
    employeeId: number
    email: string
    name: string
    roles: string[]
    permissions: string[]
    role: UserRole  // Mapped frontend role
  } | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### Why Redux?

- **Global access:** Auth state needed everywhere
- **Persistence:** State survives page refreshes
- **Consistency:** Single source of truth
- **Guards:** RoleGuard reads from Redux store
- **Navigation:** Protected routes check auth state

## 🛡️ Security Features

1. **Credentials included:** Axios configured with `withCredentials: true`
2. **Token handling:** Backend manages JWT/session tokens
3. **Session persistence:** Redux state saved to localStorage
4. **Session validation:** `checkAuth()` verifies on app load
5. **Role-based access:** RoleGuard protects routes
6. **Error handling:** Failed auth clears state and redirects

## 🔌 Integration Points

### Using in Components

```typescript
// Import from feature root
import { useAuth } from "@/features/auth";

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  // Use auth state and actions
}
```

### Using in Pages

```typescript
import { LoginFeature } from "@/features/auth";

export default function LoginPage() {
  return <LoginFeature />;
}
```

### Protecting Routes

```typescript
import { RoleGuard } from "@/components/common";
import { AdminDashboard } from "@/features/admin";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}
```

## ✅ Best Practices

- **Single hook:** All auth logic in `useAuth`, no multiple auth hooks
- **No direct API calls:** Components always use hooks
- **Centralized logic:** Business logic stays in hooks, not components
- **Error handling:** All errors caught and displayed as toasts
- **Loading states:** UI disabled during async operations
- **Type safety:** TypeScript types for all auth data
- **Clean components:** Components only handle UI rendering

## 🚀 Extending Auth

To add new auth functionality (e.g., password reset):

1. **Add service** in `api/services.ts`
2. **Add mutation** in `api/mutations.ts`
3. **Extend useAuth** hook with new function
4. **Create component** if needed
5. **Export** from feature index.ts

The pattern remains the same: Component → Hook → Mutation → Service → API
