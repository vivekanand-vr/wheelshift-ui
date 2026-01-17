"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * SessionGuard Component
 * Automatically validates session and handles expiry
 * Should be placed in the authenticated layout to protect all authenticated routes
 */
export const SessionGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, validateSession } = useAuth();

  useEffect(() => {
    // Validate session on mount if authenticated
    if (isAuthenticated) {
      validateSession();
    }
  }, [isAuthenticated, validateSession]);

  return <>{children}</>;
};
