"use client";

import { useAuth } from "@/features/auth";
import type { UserRole } from "@/types";
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

  if (!user || !user.role) {
    return <>{fallback}</>;
  }

  if (!hasAccess(user.role, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
