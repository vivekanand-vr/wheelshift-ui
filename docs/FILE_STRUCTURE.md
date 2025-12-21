# File Structure Reference

## Complete Directory Tree

```
wheelshift-ui/
│
├── 📄 ARCHITECTURE.md              # Complete architecture documentation
├── 📄 QUICKSTART.md                # Quick start guide with examples
├── 📄 PROJECT_SUMMARY.md           # This project summary
├── 📄 README.md                    # Main readme
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 next.config.ts
├── 📄 tailwind.config.ts
├── 📄 eslint.config.mjs
├── 📄 jest.config.ts
│
├── 📂 app/                         # Next.js App Router
│   ├── 📂 (authenticated)/         # ⭐ Protected routes group
│   │   ├── 📄 layout.tsx          # Auth layout (Sidebar + Header)
│   │   ├── 📂 dashboard/
│   │   │   └── 📄 page.tsx        # Dashboard page (single import)
│   │   └── 📂 tasks/
│   │       └── 📄 page.tsx        # Tasks page (single import)
│   │
│   ├── 📂 login/
│   │   └── 📄 page.tsx            # Login page
│   │
│   ├── 📂 api/                     # API routes (if needed)
│   │   └── 📂 analytics/
│   │       └── 📄 route.ts
│   │
│   ├── 📄 layout.tsx               # Root layout
│   ├── 📄 page.tsx                 # Home page (redirects)
│   └── 📄 globals.css              # Global styles + theme
│
├── 📂 features/                    # ⭐ FEATURE-BASED MODULES
│   │
│   ├── 📂 auth/                    # Authentication feature
│   │   ├── 📂 components/
│   │   │   ├── 📄 LoginForm.tsx
│   │   │   ├── 📄 LoginFeature.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📂 hooks/
│   │   │   ├── 📄 useLogin.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📂 types/
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts            # Feature barrel export
│   │
│   ├── 📂 dashboard/               # Dashboard feature
│   │   ├── 📂 components/
│   │   │   ├── 📄 StatCard.tsx
│   │   │   ├── 📄 RecentActivity.tsx
│   │   │   ├── 📄 DashboardFeature.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📂 hooks/
│   │   │   └── 📄 index.ts
│   │   ├── 📂 api/
│   │   │   └── 📄 index.ts
│   │   ├── 📂 types/
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   └── 📂 tasks/                   # Tasks feature
│       ├── 📂 components/
│       │   ├── 📄 TaskCard.tsx
│       │   ├── 📄 TasksFeature.tsx
│       │   └── 📄 index.ts
│       ├── 📂 hooks/
│       │   └── 📄 index.ts
│       ├── 📂 api/
│       │   └── 📄 index.ts
│       ├── 📂 types/
│       │   └── 📄 index.ts
│       └── 📄 index.ts
│
├── 📂 components/                  # Shared components
│   │
│   ├── 📂 layout/                  # Layout components
│   │   ├── 📄 Sidebar.tsx         # ⭐ Collapsible sidebar
│   │   ├── 📄 SidebarItem.tsx
│   │   ├── 📄 Header.tsx          # ⭐ Header with theme toggle
│   │   └── 📄 index.ts
│   │
│   ├── 📂 common/                  # Common reusable components
│   │   ├── 📄 Container.tsx       # ⭐ Consistent spacing
│   │   ├── 📄 PageHeader.tsx      # Page header component
│   │   ├── 📄 Section.tsx         # Section wrapper
│   │   ├── 📄 EmptyState.tsx      # Empty state display
│   │   └── 📄 index.ts
│   │
│   ├── 📂 ui/                      # shadcn/ui components
│   │   ├── 📄 avatar.tsx
│   │   ├── 📄 badge.tsx
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 dialog.tsx
│   │   ├── 📄 dropdown-menu.tsx
│   │   ├── 📄 form.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 label.tsx
│   │   ├── 📄 scroll-area.tsx
│   │   ├── 📄 select.tsx
│   │   ├── 📄 separator.tsx
│   │   ├── 📄 skeleton.tsx
│   │   ├── 📄 sonner.tsx
│   │   ├── 📄 tabs.tsx
│   │   ├── 📄 textarea.tsx
│   │   └── 📄 typography.tsx
│   │
│   ├── 📂 forms/
│   │   └── 📄 login-form.tsx
│   │
│   └── 📄 web-vitals-reporter.tsx
│
├── 📂 lib/                         # Utilities and core logic
│   │
│   ├── 📂 constants/               # ⭐ APPLICATION CONSTANTS
│   │   ├── 📄 colors.ts           # Theme color system
│   │   ├── 📄 navigation.ts       # Sidebar navigation config
│   │   └── 📄 index.ts
│   │
│   ├── 📂 redux/                   # Redux state management
│   │   ├── 📂 features/
│   │   │   ├── 📂 auth/           # ⭐ Auth state
│   │   │   │   ├── 📄 authSlice.ts
│   │   │   │   ├── 📄 hooks.ts
│   │   │   │   ├── 📄 api.ts
│   │   │   │   ├── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📂 theme/          # ⭐ Theme state
│   │   │   │   ├── 📄 themeSlice.ts
│   │   │   │   └── 📄 hooks.ts
│   │   │   └── 📄 exampleSlice.ts
│   │   ├── 📄 store.ts            # Redux store
│   │   └── 📄 provider.tsx        # Redux provider
│   │
│   ├── 📂 rbac/                    # ⭐ ROLE-BASED ACCESS CONTROL
│   │   ├── 📄 permissions.ts      # Permission utilities
│   │   ├── 📄 Protected.tsx       # <Protected> component
│   │   ├── 📄 useRBAC.ts          # RBAC hook
│   │   └── 📄 index.ts
│   │
│   ├── 📂 theme/
│   │   └── 📄 ThemeProvider.tsx
│   │
│   ├── 📂 api/
│   │   ├── 📄 axios.ts            # Axios instance with auth
│   │   └── 📄 services.ts
│   │
│   ├── 📂 react-query/
│   │   └── 📄 provider.tsx        # TanStack Query provider
│   │
│   ├── 📂 monitoring/
│   │   ├── 📄 analytics.ts
│   │   └── 📄 web-vitals.ts
│   │
│   ├── 📂 validations/
│   │   └── 📄 schemas.ts
│   │
│   └── 📄 utils.ts                # Utility functions
│
├── 📂 __tests__/                   # Tests
│   └── 📂 components/
│       └── 📄 button.test.tsx
│
└── 📂 public/                      # Static assets
    └── (images, fonts, etc.)
```

## Key Files Explained

### Configuration Files

| File                 | Purpose                    |
| -------------------- | -------------------------- |
| `package.json`       | Dependencies and scripts   |
| `tsconfig.json`      | TypeScript configuration   |
| `next.config.ts`     | Next.js configuration      |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `eslint.config.mjs`  | ESLint rules               |
| `jest.config.ts`     | Jest testing configuration |

### App Structure

| Path                             | Purpose                       |
| -------------------------------- | ----------------------------- |
| `app/layout.tsx`                 | Root layout with providers    |
| `app/(authenticated)/layout.tsx` | Protected routes layout       |
| `app/(authenticated)/*/page.tsx` | Protected pages               |
| `app/login/page.tsx`             | Login page                    |
| `app/globals.css`                | Global styles + CSS variables |

### Features

| Path                          | Purpose                  |
| ----------------------------- | ------------------------ |
| `features/[name]/components/` | Feature UI components    |
| `features/[name]/hooks/`      | Feature custom hooks     |
| `features/[name]/api/`        | Feature API services     |
| `features/[name]/types/`      | Feature TypeScript types |
| `features/[name]/index.ts`    | Feature exports          |

### Components

| Path                 | Purpose                      |
| -------------------- | ---------------------------- |
| `components/layout/` | App layout (Sidebar, Header) |
| `components/common/` | Reusable components          |
| `components/ui/`     | shadcn/ui components         |

### Library

| Path             | Purpose                   |
| ---------------- | ------------------------- |
| `lib/constants/` | App-wide constants        |
| `lib/redux/`     | Redux store and slices    |
| `lib/rbac/`      | Role-based access control |
| `lib/api/`       | API configuration         |
| `lib/theme/`     | Theme provider            |

## Import Patterns

### Feature Imports (in pages)

```tsx
import { DashboardFeature } from "@/features/dashboard";
```

### Component Imports

```tsx
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { Sidebar } from "@/components/layout/Sidebar";
```

### Hook Imports

```tsx
import { useAuth } from "@/lib/redux/features/auth/hooks";
import { useTheme } from "@/lib/redux/features/theme/hooks";
import { useRBAC } from "@/lib/rbac";
```

### Constant Imports

```tsx
import { colors, navigationItems } from "@/lib/constants";
```

## Navigation Flow

```
User visits /
  ↓
Redirects to /dashboard
  ↓
Auth Layout checks authentication
  ↓
If not authenticated → /login
  ↓
Login form → Auth Redux → API
  ↓
On success → /dashboard
  ↓
Dashboard renders with Sidebar + Header
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useLogin.ts`)
- **Types**: PascalCase (e.g., `User`, `LoginCredentials`)
- **Constants**: camelCase or UPPER_CASE
- **Pages**: lowercase `page.tsx`
- **Layouts**: lowercase `layout.tsx`

## Quick Navigation

Need to find something? Here's where to look:

| Looking for...   | Check here                            |
| ---------------- | ------------------------------------- |
| Add a new page   | `app/(authenticated)/[name]/page.tsx` |
| Create a feature | `features/[name]/`                    |
| Modify sidebar   | `lib/constants/navigation.ts`         |
| Change colors    | `lib/constants/colors.ts`             |
| Auth logic       | `lib/redux/features/auth/`            |
| UI components    | `components/ui/`                      |
| RBAC             | `lib/rbac/`                           |
| API config       | `lib/api/axios.ts`                    |
| Theme toggle     | `lib/redux/features/theme/`           |

---

This structure is designed for **scalability**, **maintainability**, and **developer experience**. Each folder has a clear purpose, and the patterns are consistent throughout the codebase.
