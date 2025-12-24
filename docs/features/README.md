# Feature Architecture Pattern

This document explains the standardized architecture pattern for all features in WheelShiftProUI.

## 📁 Feature Folder Structure

Each feature follows this structure:

```
features/
  feature-name/
    ├── api/              # API calls
    ├── components/       # UI components
    ├── hooks/            # Custom React hooks
    ├── queries/          # React Query configurations
    ├── store/            # Redux slice (if needed)
    ├── types/            # TypeScript types
    └── index.ts          # Feature exports
```

## 🔄 Data Flow Pattern

**Correct Order: UI → Hooks → Queries → API**

```
Component (UI) → Hook (Business Logic) → Query (Caching) → API (HTTP)
```

## 📝 API Layer

Use the configured axios instance from `@/lib/api/axios`:

```typescript
import { api } from "@/lib/api/axios";
import type { LoginCredentials, LoginResponse } from "../types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
```

**Note:** `withCredentials` is already configured globally in the axios instance. No need to add it per request.

## 🏪 Redux Store Integration

### When to Use Redux Slice

Use Redux slice when you need:

- Global state across multiple features
- State persistence (localStorage)
- Complex state management

### Feature Store Location

Redux slices belong in the feature folder:

```
features/
  auth/
    store/
      authSlice.ts    ← Redux slice HERE
      index.ts
```

**NOT in lib/redux/** - Keep lib/redux for configuration only.

### Importing Feature Slices

In `lib/redux/store.ts`, import from feature folders:

```typescript
import authReducer from "@/features/auth/store/authSlice";
import dashboardReducer from "@/features/dashboard/store/dashboardSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
});
```

## 📊 Complete Example Structure

```
features/
  dashboard/
    ├── api/
    │   └── index.ts              # dashboardApi.getStats(), etc.
    ├── queries/
    │   └── index.ts              # React Query configs
    ├── hooks/
    │   ├── useDashboard.ts       # Main hook
    │   └── index.ts
    ├── components/
    │   ├── DashboardContainer.tsx
    │   └── index.ts
    ├── store/                    # Optional: if global state needed
    │   ├── dashboardSlice.ts
    │   └── index.ts
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    └── index.ts                  # Feature exports
```

## ✅ Best Practices

### DO ✓

- Use `api` from `@/lib/api/axios` (withCredentials configured)
- Keep API functions pure (no state management)
- Put data transformations in queries layer
- Use hooks for business logic
- Keep components focused on UI
- Put feature slices in feature folders
- Export everything through feature's index.ts

### DON'T ✗

- Don't create new axios instances
- Don't put business logic in components
- Don't call APIs directly from components
- Don't put feature slices in lib/redux
- Don't import from internal folders (use index.ts)

## 📚 Import Examples

```typescript
// ✓ Correct - Import from feature root
import { useAuth, authApi, LoginFormData } from "@/features/auth";

// ✓ Correct - Import axios instance
import { api } from "@/lib/api/axios";

// ✗ Incorrect - Don't import from internal folders
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/index";
```

## 🎯 Summary

**Key Principles:**

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Feature Cohesion**: All feature code stays together
3. **Clear Data Flow**: UI → Hooks → Queries → API
4. **Redux for Global State**: Store slices in feature folders
5. **Clean Imports**: Export through feature index.ts
6. **Centralized API Config**: Use configured axios instance

This pattern ensures:

- ✅ Maintainable codebase
- ✅ Easy testing
- ✅ Clear dependencies
- ✅ Reusable components
- ✅ Scalable architecture
