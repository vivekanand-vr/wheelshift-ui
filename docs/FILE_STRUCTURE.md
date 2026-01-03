# File Structure Reference

## Complete Directory Overview

```
wheelshift-ui/
│
├── 📂 app/                         # Next.js App Router
│   ├── 📂 (authenticated)/         # ⭐ Protected routes group
│   │   ├── layout.tsx             # Auth layout (Sidebar + Header)
│   │   ├── 📂 analytics/          # Analytics dashboard page
│   │   ├── 📂 calendar/           # Calendar page
│   │   ├── 📂 dashboard/          # Main dashboard page
│   │   ├── 📂 notifications/      # Notifications page
│   │   ├── 📂 orders/             # Orders management page
│   │   ├── 📂 products/           # Products page
│   │   ├── 📂 profile/            # User profile page
│   │   ├── 📂 settings/           # Settings page
│   │   ├── 📂 tasks/              # Tasks management page
│   │   └── 📂 team/               # Team page
│   │
│   ├── 📂 api/                     # API routes
│   │   ├── 📂 analytics/          # Analytics API endpoints
│   │   └── 📂 logs/               # Logging endpoints
│   │       └── 📂 web-vitals/     # Web vitals logging
│   │
│   ├── 📂 login/                   # Login page (public)
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Home page (redirects)
│   └── globals.css                 # Global styles + CSS variables
│
├── 📂 features/                    # ⭐ FEATURE-BASED MODULES
│   │
│   ├── 📂 auth/                    # Authentication feature
│   │   ├── 📂 api/                # Auth API services, mutations, queries
│   │   ├── 📂 components/         # Login form and auth UI
│   │   ├── 📂 hooks/              # useAuth hook with business logic
│   │   ├── 📂 store/              # Redux slice for auth state
│   │   ├── 📂 types/              # Auth-specific TypeScript types
│   │   ├── 📂 validations/        # Auth-specific Zod schemas
│   │   └── index.ts               # Feature barrel export
│   │
│   ├── 📂 dashboard/               # Dashboard feature
│   │   ├── 📂 api/                # Dashboard API services
│   │   ├── 📂 components/         # Dashboard UI components
│   │   │   ├── 📂 dashboards/    # Role-specific dashboards
│   │   │   └── 📂 widgets/       # Reusable dashboard widgets
│   │   ├── 📂 hooks/              # Dashboard business logic hooks
│   │   ├── 📂 queries/            # React Query configurations
│   │   ├── 📂 types/              # Dashboard-specific types
│   │   └── index.ts               # Feature exports
│   │
│   └── 📂 tasks/                   # Tasks management feature
│       ├── 📂 api/                # Tasks API services, mutations, queries
│       ├── 📂 components/         # Task cards, kanban board, modals
│       ├── 📂 hooks/              # useTasks hook with business logic
│       ├── 📂 store/              # Redux slice for tasks state
│       ├── 📂 types/              # Task-specific types
│       └── index.ts               # Feature exports
│
├── 📂 components/                  # Shared components across features
│   │
│   ├── 📂 layout/                  # Layout components
│   │   ├── Sidebar.tsx            # ⭐ Collapsible sidebar navigation
│   │   ├── SidebarItem.tsx        # Individual sidebar items
│   │   ├── Header.tsx             # ⭐ App header with user menu
│   │   └── index.ts               # Layout exports
│   │
│   ├── 📂 common/                  # Common reusable components
│   │   ├── Container.tsx          # ⭐ Consistent page container
│   │   ├── PageHeader.tsx         # Page header component
│   │   ├── Section.tsx            # Section wrapper
│   │   ├── EmptyState.tsx         # Empty state display
│   │   ├── ConfirmationDialog.tsx # Confirmation dialog
│   │   ├── RoleGuard.tsx          # ⭐ Role-based content guard
│   │   └── index.ts               # Common exports
│   │
│   ├── 📂 ui/                      # shadcn/ui base components
│   │   ├── avatar.tsx             # Avatar component
│   │   ├── badge.tsx              # Badge component
│   │   ├── button.tsx             # Button variants
│   │   ├── card.tsx               # Card layouts
│   │   ├── dialog.tsx             # Modal dialogs
│   │   ├── dropdown-menu.tsx      # Dropdown menus
│   │   ├── form.tsx               # Form components
│   │   ├── input.tsx              # Input fields
│   │   ├── label.tsx              # Form labels
│   │   ├── progress.tsx           # Progress bars
│   │   ├── scroll-area.tsx        # Scrollable areas
│   │   ├── select.tsx             # Select dropdowns
│   │   ├── separator.tsx          # Visual separators
│   │   ├── skeleton.tsx           # Loading skeletons
│   │   ├── sonner.tsx             # Toast notifications
│   │   ├── switch.tsx             # Toggle switches
│   │   ├── tabs.tsx               # Tab navigation
│   │   ├── textarea.tsx           # Text areas
│   │   └── typography.tsx         # Typography variants
│   │
│   ├── 📂 forms/                   # Form components
│   │   └── login-form.tsx         # Example login form
│   │
│   └── web-vitals-reporter.tsx    # Performance monitoring
│
├── 📂 lib/                         # Core utilities and configurations
│   │
│   ├── 📂 api/                     # API configuration
│   │   └── axios.ts               # ⭐ Configured Axios instance
│   │
│   ├── 📂 constants/               # ⭐ Application-wide constants
│   │   ├── colors.ts              # Theme color system
│   │   ├── navigation.ts          # Sidebar navigation config
│   │   └── index.ts               # Constants exports
│   │
│   ├── 📂 monitoring/              # Application monitoring
│   │   ├── analytics.ts           # Analytics tracking
│   │   ├── logger.ts              # Logging utilities
│   │   └── web-vitals.ts          # Web vitals monitoring
│   │
│   ├── 📂 rbac/                    # ⭐ Role-Based Access Control
│   │   ├── permissions.ts         # Permission definitions
│   │   ├── Protected.tsx          # Protected component wrapper
│   │   ├── useRBAC.ts             # RBAC hook
│   │   └── index.ts               # RBAC exports
│   │
│   ├── 📂 react-query/             # React Query configuration
│   │   └── provider.tsx           # TanStack Query provider
│   │
│   ├── 📂 redux/                   # Redux configuration
│   │   ├── store.ts               # Redux store setup
│   │   └── provider.tsx           # Redux provider
│   │
│   ├── 📂 theme/                   # ⭐ Theme system
│   │   ├── ThemeProvider.tsx      # Theme provider component
│   │   ├── themeSlice.ts          # Redux slice for theme
│   │   ├── hooks.ts               # useTheme hook
│   │   └── index.ts               # Theme exports
│   │
│   ├── 📂 validations/             # Shared validation schemas
│   │   └── index.ts               # Common Zod schemas
│   │
│   └── utils.ts                    # Utility functions
│
├── 📂 types/                       # ⭐ Global TypeScript types
│   ├── user.ts                     # User-related types
│   └── index.ts                    # Type exports
│
├── 📂 assets/                      # Static assets
│   └── 📂 images/                  # Image files
│
├── 📂 __tests__/                   # Test files
│   └── 📂 components/              # Component tests
│
└── 📂 public/                      # Public static files
    └── (favicon, robots.txt, etc.)
```

## Directory Purpose Guide

### 📂 app/

**Purpose:** Next.js App Router structure

- Route definitions and page components
- Minimal logic - imports main feature components
- Protected routes grouped in `(authenticated)/`
- API routes in `api/` subdirectory

### 📂 features/

**Purpose:** Feature-based architecture - each feature is self-contained

Each feature contains:

- **api/** - API services, mutations, and queries
- **components/** - Feature-specific UI components
- **hooks/** - Business logic and state management
- **store/** - Redux slice (if global state needed)
- **types/** - Feature-specific TypeScript types
- **validations/** - Feature-specific Zod schemas
- **constants/** - Feature-specific constants

**Current Features:**

- **auth/** - Authentication (login, logout, session)
- **dashboard/** - Role-based dashboards with widgets
- **tasks/** - Task management with kanban board

### 📂 components/

**Purpose:** Shared components used across multiple features

- **layout/** - App structure (Sidebar, Header)
- **common/** - Reusable components (Container, RoleGuard, etc.)
- **ui/** - shadcn/ui base components
- **forms/** - Shared form components

### 📂 lib/

**Purpose:** Core utilities, configurations, and shared logic

- **api/** - Axios configuration with interceptors
- **constants/** - App-wide constants (colors, navigation)
- **monitoring/** - Analytics and performance tracking
- **rbac/** - Role-based access control system
- **react-query/** - React Query provider setup
- **redux/** - Redux store configuration
- **theme/** - Theme provider and management
- **validations/** - Shared validation schemas

### 📂 types/

**Purpose:** Global TypeScript type definitions

- Types used across multiple features
- Shared interfaces and type exports

### 📂 assets/

**Purpose:** Static assets (images, icons, etc.)

- Organized by asset type
- Referenced in components via imports

## Import Patterns

### Feature Imports (in pages)

```tsx
// Import main feature component
import { LoginFeature } from "@/features/auth";
import { DashboardContainer } from "@/features/dashboard";
import { TasksContainer } from "@/features/tasks";
```

### Component Imports

```tsx
// UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Common components
import { Container, PageHeader, RoleGuard } from "@/components/common";

// Layout components
import { Sidebar, Header } from "@/components/layout";
```

### Hook Imports

```tsx
// Feature hooks
import { useAuth } from "@/features/auth";
import { useTasks } from "@/features/tasks";

// Library hooks
import { useTheme } from "@/lib/theme";
import { useRBAC } from "@/lib/rbac";
```

### Constant Imports

```tsx
import { colors, navigationItems } from "@/lib/constants";
```

### Type Imports

```tsx
// Global types
import type { User, UserRole } from "@/types";

// Feature types
import type { Task, TaskStatus } from "@/features/tasks";
```

## Architecture Principles

### Feature Organization

- **Self-contained:** Each feature has everything it needs
- **Consistent structure:** All features follow the same pattern
- **Clear separation:** Components → Hooks → Mutations/Queries → Services
- **Export pattern:** All exports through feature's index.ts

### Component Organization

- **ui/**: Base shadcn/ui components (no modifications)
- **common/**: Reusable components across features
- **layout/**: App structure components (Sidebar, Header)
- **Feature-specific**: Within feature folders

### State Management

- **Redux:** Global state (auth, theme, shared data)
- **React Query:** Server state and caching
- **Local state:** Component-specific state with useState

### Code Location Rules

| Item Type   | Single Feature Use             | Multiple Feature Use |
| ----------- | ------------------------------ | -------------------- |
| Components  | `features/[name]/components/`  | `components/common/` |
| Types       | `features/[name]/types/`       | `types/`             |
| Constants   | `features/[name]/constants/`   | `lib/constants/`     |
| Validations | `features/[name]/validations/` | `lib/validations/`   |
| Hooks       | `features/[name]/hooks/`       | Custom lib folder    |

## Navigation Flow

```
User visits app
  ↓
Root layout loads providers (Redux, React Query, Theme)
  ↓
User directed to route
  ↓
If authenticated route → Check auth state
  ├─ Not authenticated → Redirect to /login
  └─ Authenticated → Load protected layout
       │
       ├─ Sidebar (navigation)
       ├─ Header (user menu, theme toggle)
       └─ Page content (feature component)
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.tsx`, `TaskCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useTasks.ts`)
- **Types**: PascalCase (e.g., `User`, `Task`, `LoginCredentials`)
- **Constants**: camelCase or UPPER_CASE (e.g., `colors`, `API_URL`)
- **Pages**: lowercase `page.tsx`
- **Layouts**: lowercase `layout.tsx`
- **API Routes**: lowercase `route.ts`

## Quick Navigation Reference

| Need to...           | Go to                                 |
| -------------------- | ------------------------------------- |
| Add new page         | `app/(authenticated)/[name]/page.tsx` |
| Create feature       | `features/[name]/`                    |
| Add common component | `components/common/`                  |
| Modify sidebar nav   | `lib/constants/navigation.ts`         |
| Change theme colors  | `lib/constants/colors.ts`             |
| Auth logic           | `features/auth/hooks/useAuth.ts`      |
| Role permissions     | `lib/rbac/permissions.ts`             |
| API config           | `lib/api/axios.ts`                    |
| Global types         | `types/`                              |
| Shared validations   | `lib/validations/`                    |

---

**This structure ensures:**

- ✅ **Scalability** - Easy to add new features
- ✅ **Maintainability** - Clear organization
- ✅ **Consistency** - Predictable patterns
- ✅ **Developer Experience** - Easy to navigate and understand
