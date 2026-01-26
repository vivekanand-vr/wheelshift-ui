# WheelShift UI - Enterprise Next.js Application

A production-ready, feature-complete Next.js application with authentication, theming, RBAC, and a scalable feature-based architecture.

## Overview

This is a modern web application built with Next.js 16, React 19, and TypeScript. It includes a complete authentication system, role-based access control, light/dark theme support, and multiple feature modules following a scalable architecture pattern.

## Key Features

**Authentication & Authorization**

- Complete login/logout flow with JWT token management
- Protected routes with automatic redirection
- Role-based access control (RBAC)
- Session management and token refresh

**Theme System**

- Light/Dark mode toggle with system preference detection
- Comprehensive color palette
- LocalStorage persistence
- Consistent styling across all components

**User Interface**

- Collapsible sidebar navigation with dropdown support
- Professional header with user menu
- 20+ shadcn/ui components
- Fully responsive design
- Loading states and skeleton components

**Feature Modules**

- **Access Control** - Comprehensive RBAC management interface for roles, permissions, employees, and ACLs
- **Authentication** - Login system with form validation and session management
- **Dashboard** - Overview page with stats and widgets
- **Tasks** - Task management with kanban board and table views

## Documentation

**Feature Documentation**

- [Access Control Guide](./docs/features/access-control/README.md) - Complete guide to RBAC management
- [Authentication Guide](./docs/features/auth/README.md) - Authentication system documentation
- [Dashboard Guide](./docs/features/dashboard/README.md) - Dashboard feature documentation
- [Tasks Guide](./docs/features/tasks/README.md) - Task management documentation
- [RoleGuard Component](./docs/features/roleGuard/README.md) - Permission-based component protection

**General Documentation**

- [File Structure](./docs/FILE_STRUCTURE.md) - Project organization and file locations
- [Features Overview](./docs/features/README.md) - Overview of all feature modules
- [Error Handling](./docs/error/README.md) - Error handling patterns and components

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## Tech Stack

**Core Framework**

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

**UI Components**

- shadcn/ui (Radix UI primitives)
- Lucide React (icons)
- Framer Motion (animations)

**State Management**

- Redux Toolkit (global state)
- TanStack Query (server state & caching)
- React Hook Form (form management)

**Data & Validation**

- Axios (HTTP client with interceptors)
- Zod (schema validation)

**Development Tools**

- ESLint (linting)
- Prettier (code formatting)
- Jest & React Testing Library (testing)
- Husky (git hooks)

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Feature-Based Architecture

The application follows a feature-based architecture where each feature is self-contained with its own components, hooks, API services, and types:

```
features/[feature-name]/
  ├── components/    # UI components
  ├── hooks/         # Custom hooks
  ├── api/           # API services
  ├── types/         # TypeScript types
  └── index.ts       # Public exports
```

This structure promotes:

- Code organization and maintainability
- Feature isolation and reusability
- Clear separation of concerns
- Easy testing and debugging

## Authentication

The authentication system uses JWT tokens with automatic refresh:

```tsx
import { useAuth } from "@/features/auth";

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginForm onSubmit={login} />;
  }

  return <div>Welcome, {user.name}</div>;
}
```

## Role-Based Access Control

Protect routes and components based on user roles:

```tsx
import { RoleGuard } from "@/components/common/RoleGuard";

<RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
  <AdminContent />
</RoleGuard>;
```

Or use the hook for programmatic checks:

```tsx
import { useRBAC } from "@/lib/rbac";

function MyComponent() {
  const { hasPermission } = useRBAC();

  if (hasPermission("EMPLOYEE:write")) {
    return <EditButton />;
  }
}
```

## Theme System

Toggle between light and dark modes:

```tsx
import { useTheme } from "@/lib/theme";

function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current: {mode}</button>;
}
```

Classes automatically adapt to the theme:

```tsx
<div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
  Content adapts to theme
</div>
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Deployment

**Vercel (Recommended)**

```bash
npm i -g vercel
vercel
```

**Other Platforms**

Build and deploy the `.next` folder:

```bash
npm run build
npm run start
```

## Code Quality

Pre-commit hooks automatically run:

- ESLint checks on staged files
- Prettier formatting on staged files

This ensures consistent code quality across the project.

## Performance Monitoring

Web Vitals (CLS, FID, FCP, LCP, TTFB, INP) are automatically tracked and can be sent to your analytics endpoint. Configure in:

- `lib/monitoring/web-vitals.ts`
- `app/api/analytics/route.ts`

## Testing

Write tests using Jest and React Testing Library:

```tsx
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

Run tests:

```bash
npm run test
```
