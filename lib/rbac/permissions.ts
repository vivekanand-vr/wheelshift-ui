import type { UserRole } from "@/lib/constants/navigation";

/**
 * Check if a user has permission to access a route based on their role
 */
export function hasAccess(
  userRole: UserRole,
  allowedRoles?: UserRole[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user has one of multiple roles
 */
export function hasRole(userRole: UserRole, roles: UserRole[]): boolean {
  return roles.includes(userRole);
}

/**
 * Check if a user is an admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === "admin";
}

/**
 * Check if a user is a manager or above
 */
export function isManagerOrAbove(userRole: UserRole): boolean {
  return ["admin", "manager"].includes(userRole);
}

/**
 * Get role priority (higher number = more permissions)
 */
export function getRolePriority(role: UserRole): number {
  const priorities: Record<UserRole, number> = {
    admin: 4,
    manager: 3,
    user: 2,
    guest: 1,
  };
  return priorities[role] || 0;
}

/**
 * Check if a role has higher priority than another
 */
export function hasHigherRole(
  userRole: UserRole,
  compareRole: UserRole
): boolean {
  return getRolePriority(userRole) > getRolePriority(compareRole);
}
