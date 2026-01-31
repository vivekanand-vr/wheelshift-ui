"use client";

import { ReactNode } from "react";

/**
 * SessionGuard Component (DEPRECATED for JWT Authentication)
 *
 * This component was used for session-based authentication to periodically
 * validate sessions. With JWT token-based authentication, session validation
 * is not needed as tokens are validated on each API request.
 *
 * This component now acts as a simple wrapper and can be safely removed
 * from your layouts.
 *
 * @deprecated Use JWT token-based authentication which validates on each request
 */
export const SessionGuard: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // No session validation needed for JWT - tokens are validated on each request
  return <>{children}</>;
};
