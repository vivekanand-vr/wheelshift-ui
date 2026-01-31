# Feature Architecture Pattern

This document explains the standardized architecture pattern for all features in WheelShiftProUI.

## Standard Feature Structure

Every feature follows this consistent folder structure:

```
features/
  feature-name/
    ├── api/
    │   ├── services.ts          # Pure API calls using Axios
    │   ├── mutations.ts         # React Query mutations
    │   ├── queries.ts           # React Query queries
    │   └── index.ts             # API exports
    │
    ├── components/              # Feature UI components
    │   ├── FeatureName.tsx      # Main feature component
    │   ├── ChildComponent.tsx   # Supporting components
    │   └── index.ts             # Component exports
    │
    ├── hooks/
    │   ├── useFeatureName.ts    # Main hook (all business logic)
    │   └── index.ts             # Hook exports
    │
    ├── store/                   # Optional: Global state
    │   ├── featureSlice.ts      # Redux slice
    │   └── index.ts             # Store exports
    │
    ├── types/                   # Feature-specific types
    │   └── index.ts
    │
    ├── constants/               # Optional: Feature-specific constants
    │   └── index.ts
    │
    ├── validations/             # Optional: Feature-specific validations
    │   └── schemas.ts           # Zod schemas for this feature
    │
    └── index.ts                 # Main feature exports
```

## Architecture Flow

The architecture follows a clear unidirectional data flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PAGE (app/*/page.tsx)                                          │
│  • Imports main feature component                               │
│  • Wraps in RoleGuard if needed                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENTS (features/*/components/)                            │
│  • UI rendering only                                            │
│  • Calls hooks for data and actions                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  HOOKS (features/*/hooks/)                                      │
│  • ALL business logic lives here                                │
│  • Calls mutations/queries                                      │
│  • Manages state (Redux dispatch)                               │
│  • Handles navigation & toasts                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  MUTATIONS/QUERIES (features/*/api/)                            │
│  • React Query configurations                                   │
│  • Calls services functions                                     │
│  • Data transformation                                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICES (features/*/api/services.ts)                          │
│  • Pure API calls using Axios                                   │
│  • HTTP requests only                                           │
│  • No business logic                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   PARALLEL STATE    │
                    │   MANAGEMENT        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  REDUX STORE        │
                    │  (Global State)     │
                    │                     │
                    │  • User data        │
                    │  • Auth state       │
                    │  • Shared state     │
                    └─────────────────────┘
```

## Layer Responsibilities

### 1. **Services Layer** (`api/services.ts`)

- Pure API call functions using Axios
- HTTP requests and responses only
- Basic data transformation (backend → frontend format)
- No state management or side effects

### 2. **Mutations/Queries Layer** (`api/mutations.ts`, `api/queries.ts`)

- React Query mutation and query configurations
- Calls service functions
- Handles caching strategies
- Data transformations

### 3. **Hooks Layer** (`hooks/`)

- **All business logic lives here**
- Calls mutations and queries
- Manages state (Redux dispatch, local state)
- Handles side effects (navigation, toasts, etc.)
- Single source of truth for component logic

### 4. **Components Layer** (`components/`)

- UI rendering only
- User interactions
- Calls hooks for data and actions
- No direct API calls or complex logic

### 5. **Store Layer** (`store/`) - Optional

- Redux slice for global state
- Used when state needs to be:
  - Shared across features
  - Persisted to localStorage
  - Accessed by multiple components

## UI Components & Patterns

### Using Shadcn UI Components

**Always use components from `components/ui/`** for consistent design:

- `Button`, `Input`, `Select`, `Card`, `Dialog`, `Badge`, etc.
- All components are pre-configured with theme support
- Located in `components/ui/` folder

### Typography

**Use `Typography` component for all text:**

```tsx
import { Typography } from "@/components/ui/typography";

// Headings
<Typography variant="h1">Main Title</Typography>
<Typography variant="h2">Section Title</Typography>

// Body text
<Typography variant="p">Regular paragraph text</Typography>
<Typography variant="small">Smaller text</Typography>
<Typography variant="extraSmall">Extra small text</Typography>
<Typography variant="muted">Muted/secondary text</Typography>

// Other variants
<Typography variant="lead">Lead paragraph</Typography>
<Typography variant="large">Large text</Typography>
<Typography variant="code">Inline code</Typography>
```

**For unusual/edge cases only:**

- Use custom `<span>` or `<p>` tags when Typography variants don't fit
- Keep these minimal and justified

### Loading States

**1. Page/Section Loading** - Use `Loader` component:

```tsx
import Loader from "@/components/common/Loader";

{
  isLoading && <Loader />;
}
```

**2. Component Loading** - Build shimmer/skeleton components:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Create loading skeletons for your components
<Card>
  <Skeleton className="h-8 w-full" />
  <Skeleton className="mt-2 h-4 w-3/4" />
</Card>;
```

### Error & Info Modals

**Use `ErrorDialog` for errors, warnings, and info:**

```tsx
import { ErrorDialog } from "@/components/common/ErrorDialog";

<ErrorDialog
  open={showError}
  onClose={() => setShowError(false)}
  type="error" // or "warning" | "info"
  title="Operation Failed"
  detail="Could not complete the operation"
  code="ERROR_CODE"
  timestamp={new Date().toISOString()}
/>;
```

### Empty States

**Use `EmptyState` when no data is available:**

```tsx
import { EmptyState } from "@/components/common/EmptyState";
import { PackageOpen } from "lucide-react";

<EmptyState
  icon={<PackageOpen className="h-12 w-12" />}
  title="No items found"
  description="Get started by creating your first item"
  action={<Button onClick={onCreate}>Create Item</Button>}
/>;
```

### Role-Based Access Control

**Use `RoleGuard` for protected content:**

```tsx
import { RoleGuard } from "@/components/common/RoleGuard";

<RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
  <AdminPanel />
</RoleGuard>;
```

**Full RoleGuard documentation:** [RoleGuard README](./roleGuard/README.md)

---

## Where Things Go

### Feature-Specific Items

**In `features/feature-name/`:**

- Components used only by this feature
- Hooks specific to this feature
- Types used only in this feature
- API calls related to this feature
- **Constants used only in this feature** (e.g., `features/auth/constants/`)
- **Validations specific to this feature** (e.g., `features/auth/validations/`)

### Common/Shared Items

**In `components/common/`:**

- Components used by multiple features
- Reusable UI elements
- Guards (like RoleGuard)
- Layout components

**In `types/`:**

- Types used across multiple features
- Global type definitions
- Shared interfaces

**In `lib/constants/`:**

- Constants used across multiple features
- Global configuration values
- Shared enums and lookup tables

**In `lib/validations/`:**

- Validation schemas used across multiple features
- Shared Zod schemas
- Common form validations

## Role-Based Access Control

Wrap components in `RoleGuard` when needed:

```
Page Component
    │
    ├─→ RoleGuard (wraps protected content)
    │      │
    │      └─→ Feature Component (protected)
    │
    └─→ Public Feature Component (no guard needed)
```

The RoleGuard checks user roles/permissions from Redux store and conditionally renders content.

## Page Integration

Pages import and use the main feature component:

```
app/
  dashboard/
    page.tsx  ────imports──→  features/dashboard/components/Dashboard.tsx

  orders/
    page.tsx  ────imports──→  features/orders/components/Orders.tsx
```

Pages should be minimal - just import the feature component and render it (with RoleGuard if needed).

## Development Checklist

When building a new feature:

1. **Create folder structure**
   - [ ] `api/` - services.ts, mutations.ts, queries.ts
   - [ ] `components/` - UI components
   - [ ] `hooks/` - Main hook with all logic
   - [ ] `types/` - TypeScript types
   - [ ] `store/` - Redux slice (if needed)
   - [ ] `constants/` - Feature-specific constants (if needed)
   - [ ] `validations/` - Feature-specific schemas (if needed)

2. **Build bottom-up**
   - [ ] Define types first
   - [ ] Create services (API calls)
   - [ ] Create mutations/queries
   - [ ] Create hook with business logic
   - [ ] Build components
   - [ ] Create Redux slice (if needed)

3. **Integration**
   - [ ] Export from feature index.ts
   - [ ] Import main component in page.tsx
   - [ ] Wrap in RoleGuard if needed
   - [ ] Add common components to components/common
   - [ ] Add shared types to types/
   - [ ] Add shared constants to lib/constants
   - [ ] Add shared validations to lib/validations

4. **Testing**
   - [ ] Test API calls
   - [ ] Test hook logic
   - [ ] Test components
   - [ ] Test role guards

## Common Mistakes to Avoid

❌ **DON'T:**

- Put API calls directly in components
- Put business logic in components
- Put feature slices in `lib/redux/`
- Create multiple hooks for one feature
- Import from internal folders
- Forget to wrap protected features in RoleGuard

✅ **DO:**

- Keep components simple (UI only)
- Put ALL logic in hooks
- Keep services pure (API only)
- Use centralized axios instance
- Export through index.ts
- Check role requirements

## Key Principles

1. **Separation of Concerns** - Each layer has one job
2. **Feature Cohesion** - All feature code together
3. **Clear Data Flow** - Unidirectional, predictable
4. **Centralized Logic** - Hooks contain business logic
5. **Reusability** - Common items in shared folders
6. **Type Safety** - TypeScript everywhere
7. **Security** - Role guards for protected content

---

**Remember:** The goal is consistency. Every feature should follow this exact pattern, making the codebase predictable and maintainable.
