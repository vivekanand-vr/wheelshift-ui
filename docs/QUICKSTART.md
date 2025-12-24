# Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (or use mock data)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Login

Navigate to [http://localhost:3000/login](http://localhost:3000/login) and use your credentials:

```
Email: your-email@example.com
Password: your-password
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
```

## 🎨 Key Features

### Explore the Application

- **Dashboard**: `/dashboard` - View stats and analytics
- **Tasks**: `/tasks` - Manage tasks
- **Calendar**: `/calendar` - Schedule events
- **Analytics**: `/analytics` - View reports
- **Products**: `/products` - Manage inventory
- **Team**: `/team` - Manage team members
- **Settings**: `/settings` - Configure application

### Theme Toggle

Click the sun/moon icon in the header to switch between light and dark mode.

### User Menu

Click your avatar in the header to access:

- Profile settings
- Logout option

## 🔐 Role-Based Access

Different users see different navigation items based on their roles:

- **SUPER_ADMIN** - Full access
- **ADMIN** - Management features
- **SALES** - Sales and inquiries
- **INSPECTOR** - Inspections
- **FINANCE** - Financial reports
- **STORE_MANAGER** - Storage management

## 🔧 Configuration

### Change API URL

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Update App Name

Edit `components/layout/Sidebar.tsx`:

```tsx
<Typography variant="h3">Your App Name</Typography>
```

Edit `app/layout.tsx`:

```tsx
export const metadata = {
  title: "Your App Name",
  description: "Your description",
};
```

### Customize Theme Colors

Edit `lib/constants/colors.ts` to change the color palette.

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📚 Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Check [../features/README.md](../features/README.md) for feature patterns
3. Review [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) for project structure

## 🤝 Need Help?

- Review example features: `features/auth` and `features/dashboard`
- Check component examples in `components/`
- Look at hook patterns in feature hooks
- Study the auth flow in `features/auth/`

Happy coding! 🎉
