"use client";

import { useAuth } from "@/lib/redux/features/auth/hooks";
import type { UserRole } from "@/lib/constants/navigation";
import { hasAccess } from "./permissions";

interface ProtectedProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user role
 */
export function Protected({
  children,
  allowedRoles,
  fallback = null,
}: ProtectedProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  if (!hasAccess(user.role, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
