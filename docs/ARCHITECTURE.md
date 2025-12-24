# WheelShift UI - Architecture Overview

A production-ready Next.js application with feature-based architecture, authentication, and role-based access control.

## 🏗️ Architecture Overview

This application follows a **feature-based architecture** where each feature is self-contained with its own components, hooks, API services, and types.

### Core Principles

1. **Feature Cohesion** - All related code stays together
2. **Separation of Concerns** - Clear layer responsibilities
3. **Data Flow** - UI → Hooks → Queries → API
4. **Role-Based Access** - Granular permission control
5. **Type Safety** - Full TypeScript support

## 📁 Directory Structure

```
wheelshift-ui/
├── app/                        # Next.js App Router
│   ├── (authenticated)/        # Protected routes
│   │   ├── layout.tsx         # Auth layout (Sidebar + Header)
│   │   └── [pages]/           # Feature pages
│   ├── login/                 # Public login page
│   └── layout.tsx             # Root layout
│
├── features/                   # Feature modules
│   ├── auth/                  # Authentication
│   ├── dashboard/             # Dashboard
│   └── [feature-name]/        # Other features
│       ├── api/               # API calls
│       ├── components/        # UI components
│       ├── hooks/             # Custom hooks
│       ├── queries/           # React Query configs
│       ├── store/             # Redux slice (optional)
│       ├── types/             # TypeScript types
│       └── index.ts           # Exports
│
├── components/                 # Shared components
│   ├── layout/                # Layout (Sidebar, Header)
│   ├── common/                # Reusable components
│   └── ui/                    # shadcn/ui components
│
└── lib/                        # Core utilities
    ├── api/                   # API configuration
    ├── constants/             # App constants
    ├── redux/                 # Redux store
    ├── rbac/                  # Access control
    └── theme/                 # Theme system
```

## 🔄 Data Flow

```
┌─────────────┐
│  Component  │  Renders UI, handles user interaction
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    Hook     │  Business logic, state management
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Query     │  Data fetching, caching (React Query)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│     API     │  HTTP requests (axios)
└─────────────┘
```

## 🎨 Theme System

- **Light/Dark Mode** - Managed via Redux
- **Color Palette** - Defined in `lib/constants/colors.ts`
- **Persistent** - Saved to localStorage
- **System Detection** - Auto-detects OS preference

## 🔐 Authentication Flow

1. User visits protected route
2. Redirected to `/login` if not authenticated
3. Credentials sent to backend
4. Token stored (cookies via `withCredentials`)
5. User redirected to dashboard
6. Subsequent requests include auth cookies

### Auth State Management

- **Redux** - Global auth state (user, isAuthenticated)
- **Persistence** - State saved to localStorage
- **Auto-rehydration** - Restores on page reload

## 🛡️ Role-Based Access Control (RBAC)

### User Roles

- `SUPER_ADMIN` - Full system control
- `ADMIN` - Management features
- `SALES` - Sales operations
- `INSPECTOR` - Inspections
- `FINANCE` - Financial reports
- `STORE_MANAGER` - Storage management

### Protection Levels

**Component Level:**

```tsx
<RoleGuard allowedRoles={["ADMIN"]}>
  <AdminPanel />
</RoleGuard>
```

**Route Level:**
Automatic via `app/(authenticated)/layout.tsx`

**Navigation Level:**
Items filtered by role in `lib/constants/navigation.ts`

## 📦 Feature Structure

See [../features/README.md](../features/README.md) for detailed feature architecture patterns.

Each feature follows:

- API calls in `api/`
- Components in `components/`
- Business logic in `hooks/`
- React Query configs in `queries/`
- Redux state in `store/` (if needed)
- Types in `types/`

## 🔌 API Configuration

Centralized axios instance with:

- **Base URL** - Configured via environment
- **Credentials** - `withCredentials: true` by default
- **Interceptors** - Request/response logging and error handling
- **Auto-retry** - Token refresh on 401

Located in `lib/api/axios.ts`

## 🎯 Key Technologies

- **Next.js 14** - App Router, Server Components
- **React 19** - Latest features
- **TypeScript** - Full type safety
- **Redux Toolkit** - State management
- **React Query** - Server state & caching
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zod** - Schema validation

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - Detailed file structure
- [../features/README.md](../features/README.md) - Feature architecture patterns
- [../features/auth/README.md](../features/auth/README.md) - Auth feature deep dive

## 🔧 Development Workflow

1. Create feature folder structure
2. Define types
3. Create API functions
4. Add React Query configs (optional)
5. Build custom hooks
6. Create UI components
7. Add to navigation (if needed)
8. Create page route

## 🚀 Best Practices

- ✅ Use feature-based organization
- ✅ Keep components presentational
- ✅ Use configured axios instance
- ✅ Leverage RoleGuard for access control
- ✅ Export through index.ts
- ✅ Follow Data Flow pattern
- ✅ Use TypeScript strictly

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Responsive navigation
- Adaptive layouts
- Touch-friendly UI

## 🧪 Testing

- Jest - Unit testing
- React Testing Library - Component testing
- Test files in `__tests__/`

## 🎨 UI Components

- **shadcn/ui** - Base components
- **Custom Components** - Feature-specific
- **Common Components** - Shared across features
- **Layout Components** - Sidebar, Header

All styled with Tailwind CSS for consistency.
