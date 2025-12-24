"use client";

import { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import type { UserRole } from "@/lib/constants/navigation";

interface RoleGuardProps {
  /**
   * Allowed roles that can access this content
   */
  allowedRoles?: UserRole[];

  /**
   * Required permissions that user must have
   */
  requiredPermissions?: string[];

  /**
   * Logic to apply when checking multiple roles/permissions
   * - "any": User needs at least one of the specified roles/permissions (default)
   * - "all": User needs all of the specified roles/permissions
   */
  requirementType?: "any" | "all";

  /**
   * Content to render when authorized
   */
  children: ReactNode;

  /**
   * Content to render when not authorized (optional)
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode;

  /**
   * Whether to show loading state while checking auth
   */
  showLoadingState?: boolean;

  /**
   * Custom loading component (optional)
   */
  loadingComponent?: ReactNode;
}

/**
 * RoleGuard Component
 *
 * Protects content based on user roles and/or permissions.
 * Gets authentication state from Redux store.
 *
 * @example
 * // Only show to ADMIN users
 * <RoleGuard allowedRoles={["ADMIN"]}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Show to users with specific permission
 * <RoleGuard requiredPermissions={["storage:manage"]}>
 *   <StorageManager />
 * </RoleGuard>
 *
 * @example
 * // Show to users with any of the specified roles
 * <RoleGuard allowedRoles={["ADMIN", "STORE_MANAGER"]} requirementType="any">
 *   <InventoryView />
 * </RoleGuard>
 *
 * @example
 * // Show fallback when not authorized
 * <RoleGuard
 *   allowedRoles={["SUPER_ADMIN"]}
 *   fallback={<div>Access Denied</div>}
 * >
 *   <SuperAdminPanel />
 * </RoleGuard>
 */
export const RoleGuard = ({
  allowedRoles,
  requiredPermissions,
  requirementType = "any",
  children,
  fallback = null,
  showLoadingState = false,
  loadingComponent = <div>Loading...</div>,
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading state if enabled and auth is loading
  if (showLoadingState && isLoading) {
    return <>{loadingComponent}</>;
  }

  // If not authenticated, show fallback
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // If no restrictions specified, allow access
  if (!allowedRoles && !requiredPermissions) {
    return <>{children}</>;
  }

  // Check roles
  let hasRequiredRole = false;
  if (allowedRoles && allowedRoles.length > 0) {
    if (requirementType === "all") {
      // User must have all specified roles (check if user.role matches all - practically checking if role is in the list since user has one role)
      hasRequiredRole = allowedRoles.includes(user.role!);
    } else {
      // User must have at least one of the specified roles
      hasRequiredRole = allowedRoles.includes(user.role!);
    }
  } else {
    // No role requirement, consider it passed
    hasRequiredRole = true;
  }

  // Check permissions
  let hasRequiredPermissions = false;
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requirementType === "all") {
      // User must have all specified permissions
      hasRequiredPermissions = requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      );
    } else {
      // User must have at least one of the specified permissions
      hasRequiredPermissions = requiredPermissions.some((permission) =>
        user.permissions.includes(permission)
      );
    }
  } else {
    // No permission requirement, consider it passed
    hasRequiredPermissions = true;
  }

  // Determine if user is authorized based on requirements
  let isAuthorized = false;

  if (allowedRoles && requiredPermissions) {
    // Both roles and permissions are specified
    if (requirementType === "all") {
      // User must satisfy both role AND permission requirements
      isAuthorized = hasRequiredRole && hasRequiredPermissions;
    } else {
      // User must satisfy either role OR permission requirements
      isAuthorized = hasRequiredRole || hasRequiredPermissions;
    }
  } else if (allowedRoles) {
    // Only roles specified
    isAuthorized = hasRequiredRole;
  } else if (requiredPermissions) {
    // Only permissions specified
    isAuthorized = hasRequiredPermissions;
  }

  // Render children if authorized, otherwise render fallback
  return <>{isAuthorized ? children : fallback}</>;
};
