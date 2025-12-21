import { useAuth } from "@/lib/redux/features/auth/hooks";
import type { UserRole } from "@/lib/constants/navigation";
import { hasAccess, hasRole, isAdmin, isManagerOrAbove } from "./permissions";

/**
 * Hook for role-based access control
 */
export function useRBAC() {
  const { user } = useAuth();

  const checkAccess = (allowedRoles?: UserRole[]): boolean => {
    if (!user) return false;
    return hasAccess(user.role, allowedRoles);
  };

  const checkRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return hasRole(user.role, roles);
  };

  const checkIsAdmin = (): boolean => {
    if (!user) return false;
    return isAdmin(user.role);
  };

  const checkIsManagerOrAbove = (): boolean => {
    if (!user) return false;
    return isManagerOrAbove(user.role);
  };

  return {
    user,
    hasAccess: checkAccess,
    hasRole: checkRole,
    isAdmin: checkIsAdmin,
    isManagerOrAbove: checkIsManagerOrAbove,
  };
}
