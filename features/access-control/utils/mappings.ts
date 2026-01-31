import {
  Shield,
  ShieldCheck,
  User,
  Users,
  Settings,
  Car,
  FileText,
  Database,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  UserCheck,
  Wrench,
  Calendar,
  DollarSign,
  Warehouse,
  CheckSquare,
  MessageSquare,
  ShoppingCart,
  History,
  FileCheck,
  UserCog,
  type LucideIcon,
} from "lucide-react";

// Role display mappings
export const roleDisplayMap: Record<
  string,
  { label: string; icon: LucideIcon; color: string; description: string }
> = {
  SUPER_ADMIN: {
    label: "Super Administrator",
    icon: ShieldCheck,
    color: "text-purple-600 dark:text-purple-400",
    description: "Full system access with all administrative privileges",
  },
  ADMIN: {
    label: "Administrator",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    description: "Administrative access to manage users and system settings",
  },
  MANAGER: {
    label: "Manager",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    description: "Manage team operations and workflow processes",
  },
  SALES_MANAGER: {
    label: "Sales Manager",
    icon: ShoppingCart,
    color: "text-emerald-600 dark:text-emerald-400",
    description: "Oversee sales operations and team performance",
  },
  SALES: {
    label: "Sales",
    icon: DollarSign,
    color: "text-green-500 dark:text-green-400",
    description: "Handle sales transactions and customer relations",
  },
  INSPECTOR: {
    label: "Inspector",
    icon: FileCheck,
    color: "text-orange-600 dark:text-orange-400",
    description: "Perform vehicle inspections and quality checks",
  },
  FINANCE: {
    label: "Finance",
    icon: DollarSign,
    color: "text-yellow-600 dark:text-yellow-400",
    description: "Manage financial operations and transactions",
  },
  STORE_MANAGER: {
    label: "Store Manager",
    icon: Warehouse,
    color: "text-amber-600 dark:text-amber-400",
    description: "Manage storage locations and inventory",
  },
  EMPLOYEE: {
    label: "Employee",
    icon: User,
    color: "text-gray-600 dark:text-gray-400",
    description: "Standard employee access to assigned tasks",
  },
  VIEWER: {
    label: "Viewer",
    icon: Eye,
    color: "text-slate-600 dark:text-slate-400",
    description: "Read-only access to view information",
  },
};

// Resource display mappings - Based on database schema
export const resourceDisplayMap: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  cars: {
    label: "Cars",
    icon: Car,
    color: "text-blue-600 dark:text-blue-400",
  },
  car_models: {
    label: "Car Models",
    icon: Car,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  inspections: {
    label: "Inspections",
    icon: FileCheck,
    color: "text-orange-600 dark:text-orange-400",
  },
  clients: {
    label: "Clients",
    icon: UserCheck,
    color: "text-green-600 dark:text-green-400",
  },
  inquiries: {
    label: "Inquiries",
    icon: MessageSquare,
    color: "text-purple-600 dark:text-purple-400",
  },
  reservations: {
    label: "Reservations",
    icon: Calendar,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  sales: {
    label: "Sales",
    icon: ShoppingCart,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  transactions: {
    label: "Transactions",
    icon: DollarSign,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  storage: {
    label: "Storage Locations",
    icon: Warehouse,
    color: "text-amber-600 dark:text-amber-400",
  },
  employees: {
    label: "Employees",
    icon: Users,
    color: "text-teal-600 dark:text-teal-400",
  },
  tasks: {
    label: "Tasks",
    icon: CheckSquare,
    color: "text-pink-600 dark:text-pink-400",
  },
  events: {
    label: "Events",
    icon: Calendar,
    color: "text-violet-600 dark:text-violet-400",
  },
  reports: {
    label: "Reports",
    icon: FileText,
    color: "text-slate-600 dark:text-slate-400",
  },
  settings: {
    label: "System Settings",
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
  },
  acl: {
    label: "Access Control",
    icon: Lock,
    color: "text-red-600 dark:text-red-400",
  },
  audit: {
    label: "Audit Logs",
    icon: History,
    color: "text-rose-600 dark:text-rose-400",
  },
};

// Action display mappings - Based on database schema
export const actionDisplayMap: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    variant: "default" | "success" | "warning" | "destructive";
  }
> = {
  read: {
    label: "Read",
    icon: Eye,
    variant: "default",
  },
  write: {
    label: "Write",
    icon: Edit,
    variant: "warning",
  },
  delete: {
    label: "Delete",
    icon: Trash2,
    variant: "destructive",
  },
  manage: {
    label: "Manage",
    icon: Wrench,
    variant: "default",
  },
  assign: {
    label: "Assign",
    icon: UserCog,
    variant: "default",
  },
  convert: {
    label: "Convert",
    icon: Plus,
    variant: "success",
  },
  view: {
    label: "View",
    icon: Eye,
    variant: "default",
  },
  export: {
    label: "Export",
    icon: Download,
    variant: "default",
  },
};

// Helper function to get role display info
export function getRoleDisplay(roleName: string) {
  return (
    roleDisplayMap[roleName] || {
      label: roleName
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" "),
      icon: Shield,
      color: "text-gray-600 dark:text-gray-400",
      description: "Custom role",
    }
  );
}

// Helper function to get resource display info
export function getResourceDisplay(resource: string) {
  return (
    resourceDisplayMap[resource.toLowerCase()] || {
      label: resource.charAt(0).toUpperCase() + resource.slice(1),
      icon: Database,
      color: "text-gray-600 dark:text-gray-400",
    }
  );
}

// Helper function to get action display info
export function getActionDisplay(action: string) {
  return (
    actionDisplayMap[action.toLowerCase()] || {
      label: action.charAt(0).toUpperCase() + action.slice(1),
      icon: Wrench,
      variant: "default" as const,
    }
  );
}

// Helper function to format permission name for UI display
// Converts "cars:read" to "Read Cars"
export function formatPermissionName(permission: {
  resource: string;
  action: string;
}): string {
  const resource = getResourceDisplay(permission.resource);
  const action = getActionDisplay(permission.action);
  return `${action.label} ${resource.label}`;
}
