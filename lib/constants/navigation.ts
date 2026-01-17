import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  ShoppingCart,
  Package,
  UserCircle,
  Bell,
  Shield,
} from "lucide-react";
import type { UserRole } from "../../types";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: UserRole[]; // Roles that can access this route
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "INSPECTOR",
      "FINANCE",
      "STORE_MANAGER",
    ],
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: FileText,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "INSPECTOR",
      "STORE_MANAGER",
      "FINANCE",
    ],
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "INSPECTOR",
      "FINANCE",
      "STORE_MANAGER",
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    badge: "12",
    roles: ["SUPER_ADMIN", "ADMIN", "SALES"],
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "STORE_MANAGER"],
  },
  {
    title: "Access Control",
    href: "/access-control",
    icon: Shield,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "5",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "INSPECTOR",
      "FINANCE",
      "STORE_MANAGER",
    ],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "INSPECTOR",
      "FINANCE",
      "STORE_MANAGER",
      "USER",
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

export const getNavigationForRole = (role: UserRole): NavigationItem[] => {
  return navigationItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });
};
