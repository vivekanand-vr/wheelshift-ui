# WheelShift UI - Complete Frontend Architecture

A production-ready Next.js application with comprehensive authentication, theming, and feature-based architecture.

## 🏗️ Architecture Overview

This application follows a **feature-based architecture** where each feature is self-contained with its own:

- Components
- Hooks
- API services
- Types
- Business logic

### Directory Structure

```
wheelshift-ui/
├── app/
│   ├── (authenticated)/         # Protected routes group
│   │   ├── layout.tsx           # Auth layout with sidebar/header
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Single import from feature
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── [other-pages]/
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout
│   └── globals.css
│
├── features/                    # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginFeature.tsx
│   │   ├── hooks/
│   │   │   └── useLogin.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts             # Feature barrel export
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.ts
│   └── tasks/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── types/
│       └── index.ts
│
├── components/
│   ├── layout/                  # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── SidebarItem.tsx
│   │   └── Header.tsx
│   ├── common/                  # Reusable components
│   │   ├── Container.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Section.tsx
│   │   └── EmptyState.tsx
│   └── ui/                      # shadcn/ui components
│
├── lib/
│   ├── constants/               # App-wide constants
│   │   ├── colors.ts            # Theme color system
│   │   └── navigation.ts        # Sidebar navigation config
│   ├── redux/
│   │   ├── features/
│   │   │   ├── auth/            # Auth state management
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── hooks.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── types.ts
│   │   │   └── theme/           # Theme state management
│   │   │       ├── themeSlice.ts
│   │   │       └── hooks.ts
│   │   ├── store.ts
│   │   └── provider.tsx
│   ├── rbac/                    # Role-based access control
│   │   ├── permissions.ts
│   │   ├── Protected.tsx
│   │   └── useRBAC.ts
│   ├── theme/
│   │   └── ThemeProvider.tsx
│   └── utils.ts
```

## 🎨 Theme System

### Color Palette

The application uses a comprehensive color system defined in `lib/constants/colors.ts`:

- **Primary**: Blue tones for main actions
- **Secondary**: Purple tones for secondary elements
- **Success**: Green tones for positive actions
- **Warning**: Yellow/Orange tones for warnings
- **Error**: Red tones for errors
- **Neutral**: Grayscale for text and backgrounds

### Light/Dark Mode

Theme switching is managed via Redux:

```tsx
import { useTheme } from "@/lib/redux/features/theme/hooks";

function MyComponent() {
  const { mode, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

## 🔐 Authentication Flow

### Login

1. User visits `/login`
2. Submits credentials via `LoginForm`
3. Redux action dispatches API call
4. On success, token stored in localStorage
5. User redirected to `/dashboard`

### Protected Routes

All routes in `app/(authenticated)/*` are protected:

```tsx
// app/(authenticated)/layout.tsx
// Automatically checks auth and redirects to login if not authenticated
```

### Usage in Components

```tsx
import { useAuth } from "@/lib/redux/features/auth/hooks";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return <div>Welcome, {user.name}!</div>;
}
```

## 🛡️ Role-Based Access Control (RBAC)

### User Roles

- **admin**: Full access
- **manager**: Management features
- **user**: Standard features
- **guest**: Limited access

### Protecting Components

```tsx
import { Protected } from "@/lib/rbac";

function AdminPanel() {
  return (
    <Protected allowedRoles={["admin"]}>
      <div>Admin Only Content</div>
    </Protected>
  );
}
```

### Using RBAC Hook

```tsx
import { useRBAC } from "@/lib/rbac";

function MyComponent() {
  const { isAdmin, hasAccess } = useRBAC();

  if (hasAccess(["admin", "manager"])) {
    return <AdvancedFeature />;
  }

  return <BasicFeature />;
}
```

### Navigation with RBAC

Navigation items in `lib/constants/navigation.ts` support role-based filtering:

```tsx
{
  title: 'Analytics',
  href: '/analytics',
  icon: BarChart3,
  roles: ['admin', 'manager'], // Only visible to these roles
}
```

## 📦 Feature Structure

Each feature follows this pattern:

```
features/[feature-name]/
├── components/
│   ├── [Feature]Feature.tsx    # Main feature component
│   └── [Sub]Component.tsx
├── hooks/
│   └── index.ts                # Custom hooks
├── api/
│   └── index.ts                # API service
├── types/
│   └── index.ts                # TypeScript types
└── index.ts                    # Barrel export
```

### Creating a New Feature

1. **Create feature directory:**

```bash
mkdir -p features/my-feature/{components,hooks,api,types}
```

2. **Define types** (`types/index.ts`):

```tsx
export interface MyData {
  id: string;
  name: string;
}
```

3. **Create API service** (`api/index.ts`):

```tsx
import axios from "@/lib/api/axios";
import type { MyData } from "../types";

export const myService = {
  getData: async (): Promise<MyData[]> => {
    const response = await axios.get("/my-endpoint");
    return response.data;
  },
};
```

4. **Create hooks** (`hooks/index.ts`):

```tsx
import { useQuery } from "@tanstack/react-query";
import { myService } from "../api";

export const useMyData = () => {
  return useQuery({
    queryKey: ["my-data"],
    queryFn: myService.getData,
  });
};
```

5. **Create feature component** (`components/MyFeature.tsx`):

```tsx
"use client";

import { useMyData } from "../hooks";
import { Container } from "@/components/common/Container";

export function MyFeature() {
  const { data, isLoading } = useMyData();

  return <Container>{/* Your feature UI */}</Container>;
}
```

6. **Export from feature** (`index.ts`):

```tsx
export * from "./components";
export * from "./hooks";
export * from "./types";
```

7. **Create page** (`app/(authenticated)/my-feature/page.tsx`):

```tsx
import { MyFeature } from "@/features/my-feature";

export default function MyFeaturePage() {
  return <MyFeature />;
}
```

## 🎯 Common Components

### Container

Provides consistent padding and max-width:

```tsx
import { Container } from "@/components/common/Container";

<Container size="xl">{/* content */}</Container>;
```

Sizes: `sm`, `md`, `lg`, `xl`, `full`

### PageHeader

Consistent page headers with actions:

```tsx
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

<PageHeader
  title="My Page"
  description="Page description"
  actions={<Button>Action</Button>}
/>;
```

### EmptyState

Display when no data is available:

```tsx
import { EmptyState } from "@/components/common/EmptyState";
import { FileText } from "lucide-react";

<EmptyState
  icon={<FileText className="h-12 w-12" />}
  title="No data"
  description="Get started by creating something"
  action={<Button>Create</Button>}
/>;
```

## 🎨 Using shadcn/ui Components

All shadcn/ui components are in `components/ui/`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
```

## 🔍 Typography

Use the Typography component for consistent text styling:

```tsx
import { Typography } from '@/components/ui/typography';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="p">Paragraph</Typography>
<Typography variant="muted">Muted text</Typography>
<Typography variant="small">Small text</Typography>
```

## 🚀 State Management

### Redux (Global State)

Used for:

- Authentication
- Theme preferences
- Global UI state

```tsx
import { useAppSelector, useAppDispatch } from "@/lib/redux/store";
```

### React Query (Server State)

Used for:

- API data fetching
- Caching
- Background updates

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
```

### Local State

Use React hooks for component-specific state:

```tsx
const [count, setCount] = useState(0);
```

## 📱 Responsive Design

All layouts are responsive:

- **Mobile**: Single column, collapsible sidebar
- **Tablet**: 2 columns
- **Desktop**: Full layout with sidebar

Use Tailwind responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🧪 Adding New Pages

1. **Create feature directory** in `features/`
2. **Build feature components** with hooks and API
3. **Create page** in `app/(authenticated)/[page-name]/page.tsx`
4. **Add to navigation** in `lib/constants/navigation.ts`

Example:

```tsx
// lib/constants/navigation.ts
{
  title: 'My Page',
  href: '/my-page',
  icon: MyIcon,
  roles: ['admin', 'manager', 'user'],
}
```

## 🎨 Customizing Theme Colors

Edit `lib/constants/colors.ts` to change the color palette:

```tsx
export const colors = {
  primary: {
    500: "#0ea5e9", // Change this
    // ...
  },
};
```

Then update `app/globals.css` CSS variables accordingly.

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📝 Best Practices

1. **Single Import Pattern**: Pages should only import feature components
2. **Feature Isolation**: Each feature is self-contained
3. **Type Safety**: Use TypeScript for all code
4. **RBAC**: Protect routes and components based on roles
5. **Consistent Styling**: Use Typography and common components
6. **Theme Support**: Always consider dark mode
7. **Responsive**: Test on all screen sizes
8. **Accessibility**: Use semantic HTML and ARIA labels

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Redux Toolkit
- **Server State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📄 License

MIT
