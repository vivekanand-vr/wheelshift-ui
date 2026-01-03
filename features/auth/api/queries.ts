import { queryOptions } from "@tanstack/react-query";
import { authApi } from "./services";

/**
 * Auth Queries - React Query configurations for data fetching
 * Pattern: Hooks → Queries → Services (API)
 */
export const authQueries = {
  /**
   * Check current authentication status
   * Used for: Initial app load, protected route checks
   */
  checkAuth: () =>
    queryOptions({
      queryKey: ["auth", "current"],
      queryFn: () => authApi.getCurrentUser(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: false,
      refetchOnWindowFocus: false,
    }),
};
