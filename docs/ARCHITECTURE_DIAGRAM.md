# System Architecture Diagram

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ROOT LAYOUT (app/layout.tsx)                            │   │
│  │ • Redux Provider                                        │   │
│  │ • Theme Provider                                        │   │
│  │ • React Query Provider                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌──────────┐   ┌─────────────────────┐   ┌──────────────┐    │
│  │  Login   │   │  (authenticated)    │   │   Other      │    │
│  │  /login  │   │     Routes          │   │   Routes     │    │
│  └──────────┘   └─────────────────────┘   └──────────────┘    │
│                           │                                      │
│                           ▼                                      │
│              ┌────────────────────────┐                         │
│              │  Auth Layout           │                         │
│              │  • Sidebar             │                         │
│              │  • Header              │                         │
│              │  • Auth Check          │                         │
│              └────────────────────────┘                         │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                  │
│         ▼                 ▼                 ▼                  │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐              │
│  │Dashboard │     │  Tasks   │     │ Profile  │              │
│  └──────────┘     └──────────┘     └──────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
Root
│
├── Redux Store
│   ├── Auth Slice
│   │   ├── user
│   │   ├── token
│   │   └── isAuthenticated
│   │
│   └── Theme Slice
│       └── mode (light/dark)
│
├── React Query
│   └── Cached Server Data
│
└── UI Components
    ├── Layout
    │   ├── Sidebar
    │   │   └── Navigation Items
    │   └── Header
    │       ├── Search
    │       ├── Theme Toggle
    │       └── User Menu
    │
    └── Features
        ├── Dashboard
        │   ├── Stats Cards
        │   ├── Recent Activity
        │   └── Charts
        │
        └── Tasks
            ├── Task List
            ├── Task Card
            └── Task Filters
```

## Data Flow

### Authentication Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Login   │──1──▶│  Redux   │──2──▶│   API    │──3──▶│ Backend  │
│  Form    │      │  Action  │      │  Call    │      │  Server  │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
     ▲                  │                                     │
     │                  │                                     │
     └──────────────────┴─────────────────────────────────────┘
                    4. Token Saved & User Updated

┌──────────────────────────────────────────────────────────────┐
│ After Success:                                               │
│ 1. Token saved to localStorage                              │
│ 2. User data in Redux                                       │
│ 3. Redirect to /dashboard                                   │
│ 4. All API calls include token automatically               │
└──────────────────────────────────────────────────────────────┘
```

### Feature Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      FEATURE COMPONENT                       │
│                                                              │
│  1. Component Mounts                                        │
│      │                                                       │
│      ▼                                                       │
│  2. Custom Hook (useMyData)                                 │
│      │                                                       │
│      ▼                                                       │
│  3. React Query (useQuery)                                  │
│      │                                                       │
│      ▼                                                       │
│  4. API Service Function                                    │
│      │                                                       │
│      ▼                                                       │
│  5. Axios with Auth Token                                   │
│      │                                                       │
│      ▼                                                       │
│  6. Backend API                                             │
│      │                                                       │
│      ▼                                                       │
│  7. Response → Cache → Component                            │
└─────────────────────────────────────────────────────────────┘
```

## RBAC (Role-Based Access Control)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ROLES                            │
│                                                              │
│  ┌────────┐    ┌─────────┐    ┌──────┐    ┌───────┐       │
│  │ Admin  │───▶│ Manager │───▶│ User │───▶│ Guest │       │
│  └────────┘    └─────────┘    └──────┘    └───────┘       │
│  (Full Access) (Management)   (Standard)  (Limited)        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   PERMISSION CHECK                           │
│                                                              │
│  Navigation Item                                            │
│     roles: ['admin', 'manager']                             │
│          │                                                   │
│          ▼                                                   │
│  Current User Role: 'manager' ✓                             │
│          │                                                   │
│          ▼                                                   │
│  Item Visible in Sidebar                                    │
│                                                              │
│  <Protected allowedRoles={['admin']}>                       │
│     Content only visible to Admin                           │
│  </Protected>                                               │
└─────────────────────────────────────────────────────────────┘
```

## Theme System

```
┌─────────────────────────────────────────────────────────────┐
│                     THEME ARCHITECTURE                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Theme Colors (lib/constants/colors.ts)            │  │
│  │    • Light theme palette                             │  │
│  │    • Dark theme palette                              │  │
│  │    • Semantic color mappings                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 2. CSS Variables (app/globals.css)                   │  │
│  │    :root { --color-primary: ... }                    │  │
│  │    .dark { --color-primary: ... }                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 3. Theme Redux Slice                                  │  │
│  │    • Current mode (light/dark)                       │  │
│  │    • Toggle action                                   │  │
│  │    • LocalStorage persistence                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 4. Theme Provider                                     │  │
│  │    • Initializes theme on mount                      │  │
│  │    • Syncs with localStorage                         │  │
│  │    • Applies .dark class to <html>                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 5. Components                                         │  │
│  │    • Use Tailwind dark: classes                      │  │
│  │    • Automatically styled based on mode              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Feature Module Pattern

```
┌─────────────────────────────────────────────────────────────┐
│              FEATURE: Dashboard                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Types (types/index.ts)                               │  │
│  │ • DashboardStats                                     │  │
│  │ • RecentActivity                                     │  │
│  │ • ChartData                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Service (api/index.ts)                           │  │
│  │ • getStats()                                         │  │
│  │ • getRecentActivity()                                │  │
│  │ • getChartData()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Hooks (hooks/index.ts)                               │  │
│  │ • useDashboardStats()                                │  │
│  │ • useRecentActivity()                                │  │
│  │ • useChartData()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Components (components/)                             │  │
│  │ • StatCard                                           │  │
│  │ • RecentActivity                                     │  │
│  │ • DashboardFeature ← Main Component                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Export (index.ts)                                    │  │
│  │ export * from './components';                        │  │
│  │ export * from './hooks';                             │  │
│  │ export * from './types';                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
                  Used in Page
        app/(authenticated)/dashboard/page.tsx
```

## Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                   API REQUEST FLOW                           │
│                                                              │
│  User Action (Click Button)                                 │
│          │                                                   │
│          ▼                                                   │
│  React Hook (useMutation/useQuery)                          │
│          │                                                   │
│          ▼                                                   │
│  API Service Function                                       │
│          │                                                   │
│          ▼                                                   │
│  Axios Instance                                             │
│    │                                                         │
│    ├─ Add Auth Token (Interceptor)                          │
│    ├─ Add Headers                                           │
│    └─ Log Request (Dev Mode)                                │
│          │                                                   │
│          ▼                                                   │
│  HTTP Request → Backend API                                 │
│          │                                                   │
│          ▼                                                   │
│  HTTP Response ← Backend API                                │
│          │                                                   │
│          ▼                                                   │
│  Axios Instance                                             │
│    │                                                         │
│    ├─ Log Response (Dev Mode)                               │
│    ├─ Handle Errors                                         │
│    └─ Transform Data                                        │
│          │                                                   │
│          ▼                                                   │
│  React Query                                                │
│    │                                                         │
│    ├─ Update Cache                                          │
│    ├─ Trigger Refetch (if needed)                           │
│    └─ Update UI State                                       │
│          │                                                   │
│          ▼                                                   │
│  Component Re-renders with New Data                         │
│          │                                                   │
│          ▼                                                   │
│  Toast Notification (Success/Error)                         │
└─────────────────────────────────────────────────────────────┘
```

## Summary

This architecture provides:

✅ **Separation of Concerns**: Each part has a clear responsibility
✅ **Scalability**: Easy to add new features
✅ **Maintainability**: Consistent patterns throughout
✅ **Type Safety**: TypeScript everywhere
✅ **Performance**: Optimized with caching and lazy loading
✅ **Developer Experience**: Clear structure and documentation
✅ **Production Ready**: Best practices implemented

---

**Understanding this flow will help you:**

- Add new features confidently
- Debug issues effectively
- Optimize performance
- Maintain code quality
