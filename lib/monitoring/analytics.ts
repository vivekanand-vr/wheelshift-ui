"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Simple page view tracking
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

    // Log page view
    console.log("Page view:", url);

    // Send to analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
}

// Custom event tracking
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  console.log("Event:", eventName, properties);

  // Send to analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, properties);
  }
}

// Error tracking
export function trackError(error: Error, errorInfo?: Record<string, any>) {
  console.error("Error tracked:", error, errorInfo);

  // Send to error tracking service (e.g., Sentry)
  // Sentry.captureException(error, { extra: errorInfo });
}
