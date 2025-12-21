# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Test the Application

#### Login Flow

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to `/login`
3. Use these test credentials (update based on your backend):
   ```
   Email: admin@example.com
   Password: password123
   ```
4. After login, you'll be redirected to the dashboard

#### Explore Features

- **Dashboard**: `/dashboard` - View stats and recent activity
- **Tasks**: `/tasks` - Manage tasks
- **Theme Toggle**: Click sun/moon icon in header
- **User Menu**: Click avatar in header for profile/logout

## 🎨 Customization Guide

### Change Theme Colors

Edit `lib/constants/colors.ts`:

```typescript
export const colors = {
  primary: {
    500: "#YOUR_COLOR", // Main brand color
    // ...
  },
};
```

### Add Navigation Item

Edit `lib/constants/navigation.ts`:

```typescript
{
  title: 'My Feature',
  href: '/my-feature',
  icon: MyIcon,
  roles: ['admin', 'manager', 'user'], // Who can see it
}
```

### Update App Name

1. **Sidebar**: Edit `components/layout/Sidebar.tsx`

   ```tsx
   <Typography variant="h3">Your App Name</Typography>
   ```

2. **Metadata**: Edit `app/layout.tsx`
   ```tsx
   export const metadata = {
     title: "Your App Name",
     description: "Your description",
   };
   ```

## 🏗️ Create Your First Feature

### Step 1: Create Directory Structure

```bash
mkdir -p features/my-feature/{components,hooks,api,types}
```

### Step 2: Define Types

Create `features/my-feature/types/index.ts`:

```typescript
export interface MyItem {
  id: string;
  name: string;
  description?: string;
}
```

### Step 3: Create API Service

Create `features/my-feature/api/index.ts`:

```typescript
import axios from "@/lib/api/axios";
import type { MyItem } from "../types";

export const myService = {
  getItems: async (): Promise<MyItem[]> => {
    const response = await axios.get("/my-items");
    return response.data;
  },
};
```

### Step 4: Create Hook

Create `features/my-feature/hooks/index.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { myService } from "../api";

export const useMyItems = () => {
  return useQuery({
    queryKey: ["my-items"],
    queryFn: myService.getItems,
  });
};
```

### Step 5: Create Feature Component

Create `features/my-feature/components/MyFeature.tsx`:

```tsx
"use client";

import { useMyItems } from "../hooks";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Typography } from "@/components/ui/typography";

export function MyFeature() {
  const { data: items, isLoading } = useMyItems();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <PageHeader title="My Feature" description="Feature description" />
      <div className="mt-6 space-y-4">
        {items?.map((item) => (
          <div key={item.id}>
            <Typography variant="h3">{item.name}</Typography>
            <Typography variant="muted">{item.description}</Typography>
          </div>
        ))}
      </div>
    </Container>
  );
}
```

### Step 6: Create Barrel Exports

Create `features/my-feature/components/index.ts`:

```typescript
export * from "./MyFeature";
```

Create `features/my-feature/index.ts`:

```typescript
export * from "./components";
export * from "./hooks";
export * from "./types";
```

### Step 7: Create Page

Create `app/(authenticated)/my-feature/page.tsx`:

```tsx
import { MyFeature } from "@/features/my-feature";

export default function MyFeaturePage() {
  return <MyFeature />;
}
```

### Step 8: Add to Navigation

Edit `lib/constants/navigation.ts`:

```typescript
import { MyIcon } from "lucide-react";

export const navigationItems: NavigationItem[] = [
  // ... existing items
  {
    title: "My Feature",
    href: "/my-feature",
    icon: MyIcon,
    roles: ["admin", "manager", "user"],
  },
];
```

Done! Visit `/my-feature` to see your new page.

## 🔐 Role-Based Access Control

### Protect a Whole Feature

```tsx
// In your feature component
import { Protected } from "@/lib/rbac";

export function AdminFeature() {
  return (
    <Protected allowedRoles={["admin"]}>
      <Container>{/* Admin-only content */}</Container>
    </Protected>
  );
}
```

### Protect Part of a Component

```tsx
import { Protected } from "@/lib/rbac";

export function MyFeature() {
  return (
    <Container>
      <div>Everyone can see this</div>

      <Protected allowedRoles={["admin", "manager"]}>
        <div>Only admins and managers see this</div>
      </Protected>
    </Container>
  );
}
```

### Check Roles Programmatically

```tsx
import { useRBAC } from "@/lib/rbac";

export function MyFeature() {
  const { isAdmin, hasAccess } = useRBAC();

  return (
    <Container>
      {hasAccess(["admin", "manager"]) && <button>Advanced Feature</button>}
    </Container>
  );
}
```

## 🎨 Using UI Components

### Typography

```tsx
import { Typography } from '@/components/ui/typography';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="p">Paragraph</Typography>
<Typography variant="muted">Muted text</Typography>
```

### Buttons

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content here</CardContent>
</Card>;
```

### Forms

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(1),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## 📱 Common Patterns

### Loading States

```tsx
import { Skeleton } from "@/components/ui/skeleton";

if (isLoading) {
  return (
    <Container>
      <Skeleton className="mb-4 h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </Container>
  );
}
```

### Empty States

```tsx
import { EmptyState } from "@/components/common/EmptyState";
import { FileText } from "lucide-react";

if (!data || data.length === 0) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="No items found"
      description="Create your first item to get started"
      action={<Button>Create Item</Button>}
    />
  );
}
```

### Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong');

// Info
toast.info('Here's some information');

// Warning
toast.warning('Be careful!');
```

## 🔧 Configuration

### API Base URL

Edit `lib/api/axios.ts`:

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
```

Set in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Mock Data (Development)

For development without a backend, you can mock API responses:

```typescript
// features/my-feature/api/index.ts
export const myService = {
  getItems: async (): Promise<MyItem[]> => {
    // Mock data during development
    return [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ];
  },
};
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📚 Next Steps

1. Read the full [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation
2. Explore existing features in `features/` directory
3. Check out shadcn/ui docs: [ui.shadcn.com](https://ui.shadcn.com)
4. Review Next.js docs: [nextjs.org](https://nextjs.org)

## 🤝 Need Help?

- Review example features: `features/dashboard` and `features/tasks`
- Check component examples in `components/`
- Look at hook patterns in `features/*/hooks/`
- Study RBAC examples in `lib/rbac/`

Happy coding! 🎉
