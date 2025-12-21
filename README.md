# WheelShift UI - Enterprise Next.js Application

A **production-ready, feature-complete Next.js application** with authentication, theming, RBAC, and a scalable feature-based architecture.

## 🎯 What You Get

✅ **Complete Authentication System** - Login, protected routes, token management  
✅ **Beautiful Light/Dark Theme** - With comprehensive color system  
✅ **Role-Based Access Control** - Admin, Manager, User, Guest roles  
✅ **Feature-Based Architecture** - Scalable, maintainable structure  
✅ **Professional UI** - Sidebar, header, 20+ shadcn/ui components  
✅ **State Management** - Redux + TanStack Query  
✅ **Example Features** - Dashboard, Tasks, and more  
✅ **Complete Documentation** - Guides, examples, diagrams

## 📚 Documentation

**New here? Start with these guides:**

1. **[START_HERE.md](./START_HERE.md)** ⭐ - Quick overview and setup
2. **[INDEX.md](./INDEX.md)** - Documentation navigation hub
3. **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step guide with examples
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture guide
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What's been built

**For specific needs:**

- **Find files**: [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
- **Visual guide**: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
- **Code examples**: [QUICKSTART.md](./QUICKSTART.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 and you'll see the login page!

## 🎨 Key Features

### Authentication & Authorization

- Complete login/logout flow
- JWT token management
- Protected routes
- Role-based permissions (RBAC)

### Theme System

- Light/Dark mode toggle
- Comprehensive color palette
- LocalStorage persistence
- System preference detection

### Layout

- Collapsible sidebar with navigation
- Professional header with search
- User menu and notifications
- Fully responsive

### Feature-Based Structure

```
features/[name]/
  ├── components/    # UI components
  ├── hooks/         # Custom hooks
  ├── api/           # API services
  ├── types/         # TypeScript types
  └── index.ts       # Barrel export
```

### State Management

- **Redux Toolkit** - Auth, theme, global state
- **TanStack Query** - Server data, caching
- **Custom hooks** - Easy access throughout app

## 🏗️ Tech Stack

## 🏗️ Tech Stack

### Core

- **Next.js 16** - App Router
- **React 19** - Latest React
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first CSS

### UI & Styling

- **shadcn/ui** - 20+ beautiful components
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### State Management

- **Redux Toolkit** - Global state
- **TanStack Query** - Server state
- **React Hook Form** - Forms
- **Zod** - Validation

### Code Quality

- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks
- **Jest** - Testing

## 📁 Project Structure

```
wheelshift-ui/
├── app/
│   ├── (authenticated)/   # Protected routes
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── login/
│   └── layout.tsx
├── features/              # ⭐ Feature modules
│   ├── auth/
│   ├── dashboard/
│   └── tasks/
├── components/
│   ├── layout/           # Sidebar, Header
│   ├── common/           # Reusable components
│   └── ui/               # shadcn/ui
└── lib/
    ├── constants/        # Colors, navigation
    ├── redux/            # Store, slices
    └── rbac/             # Permissions
```

## 🎯 Example Features

### Dashboard (`/dashboard`)

- Stats cards with trends
- Recent activity feed
- RBAC examples
- Responsive grid layout

### Tasks (`/tasks`)

- Task management
- Filters and search
- Empty states
- CRUD operations

### Auth (`/login`)

- Login form with validation
- Token management
- Auto-redirect
- Error handling

## 🔐 RBAC (Role-Based Access Control)

```tsx
// Protect components
<Protected allowedRoles={["admin"]}>
  <AdminContent />
</Protected>;

// Or use hooks
const { isAdmin, hasAccess } = useRBAC();
if (hasAccess(["admin", "manager"])) {
  // Show feature
}
```

## 🎨 Theme System

```tsx
// Toggle theme
const { mode, toggleTheme } = useTheme();

// Automatic dark mode support
<div className="bg-white dark:bg-neutral-900">Content</div>;
```

## 📖 Learn More

Check out the comprehensive documentation:

- **[START_HERE.md](./START_HERE.md)** - Begin here!
- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Deep dive
- **[INDEX.md](./INDEX.md)** - All documentation

## 🛠️ Development

- Example login form with validation

### HTTP Client

- **Axios** - Promise-based HTTP client
  - Request/Response interceptors
  - Automatic token handling
  - Token refresh logic
  - Error handling
  - Example API service functions

### Testing

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers
- **@testing-library/user-event** - User interaction simulation
- Example test files included

### Monitoring & Analytics

- **Web Vitals** - Performance monitoring
  - CLS, FID, FCP, LCP, TTFB, INP tracking
  - Custom analytics endpoint
  - Page view tracking
  - Custom event tracking
  - Error tracking utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting without writing

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 📁 Project Structure

```
wheelshift-ui/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── analytics/        # Analytics endpoint
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── typography.tsx
│   │   └── ...
│   ├── forms/                # Form components
│   │   └── login-form.tsx
│   └── web-vitals-reporter.tsx
├── lib/
│   ├── api/                  # API utilities
│   │   ├── axios.ts          # Axios instance with interceptors
│   │   └── services.ts       # API service functions
│   ├── redux/                # Redux setup
│   │   ├── store.ts          # Redux store
│   │   ├── provider.tsx      # Redux provider
│   │   └── features/         # Redux slices
│   ├── react-query/          # TanStack Query setup
│   │   └── provider.tsx
│   ├── validations/          # Zod schemas
│   │   └── schemas.ts
│   ├── monitoring/           # Analytics & monitoring
│   │   ├── web-vitals.ts
│   │   └── analytics.ts
│   └── utils.ts              # Utility functions
├── __tests__/                # Test files
│   └── components/
├── public/                   # Static assets
├── .husky/                   # Git hooks
├── eslint.config.mjs         # ESLint configuration
├── .prettierrc               # Prettier configuration
├── jest.config.ts            # Jest configuration
├── jest.setup.ts             # Jest setup
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## 🎨 Using Components

### Shadcn UI Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Typography Component

```tsx
import { Typography } from "@/components/ui/typography";

export default function Example() {
  return (
    <>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="p">Paragraph text</Typography>
      <Typography variant="muted">Muted text</Typography>
    </>
  );
}
```

### Forms with Validation

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/schemas";

export function MyForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    console.log(data);
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### Redux State Management

```tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { increment, selectValue } from "@/lib/redux/features/exampleSlice";

export function Counter() {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectValue);

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </div>
  );
}
```

### TanStack Query

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/services";

export function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

### API Calls with Axios

```tsx
import api from "@/lib/api/axios";

// GET request
const response = await api.get("/endpoint");

// POST request
const response = await api.post("/endpoint", { data });

// Using service functions
import { authService } from "@/lib/api/services";
const result = await authService.login(email, password);
```

### Animations with Framer Motion

```tsx
import { motion } from "framer-motion";

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

### Icons with Lucide React

```tsx
import { Home, Settings, User } from "lucide-react";

export function IconExample() {
  return (
    <div>
      <Home className="h-6 w-6" />
      <Settings className="h-6 w-6" />
      <User className="h-6 w-6" />
    </div>
  );
}
```

## 🧪 Testing

Write tests using React Testing Library:

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

## 📊 Performance Monitoring

Web Vitals are automatically tracked and sent to the analytics endpoint. You can customize the reporting in:

- `lib/monitoring/web-vitals.ts`
- `app/api/analytics/route.ts`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Adding More Shadcn Components

```bash
npx shadcn@latest add [component-name]
```

## 📝 Pre-commit Hooks

Husky is configured to run:

- ESLint on staged files
- Prettier formatting on staged files

This ensures code quality before committing.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the app:

```bash
npm run build
```

Then deploy the `.next` folder to your preferred hosting platform.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and modern web technologies.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
