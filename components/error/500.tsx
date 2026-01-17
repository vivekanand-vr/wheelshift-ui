"use client";

import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Error500Props {
  /**
   * Custom title for the error page
   */
  title?: string;

  /**
   * Custom description for the error page
   */
  description?: string;

  /**
   * Show retry button (default: true)
   */
  showRetryButton?: boolean;

  /**
   * Show home button (default: true)
   */
  showHomeButton?: boolean;

  /**
   * Retry action callback
   */
  onRetry?: () => void;

  /**
   * Custom action button
   */
  customAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 500 Internal Server Error Page
 * Used when a server error occurs
 */
export const Error500 = ({
  title = "Server Error",
  description = "Something went wrong on our end. We're working to fix the issue. Please try again later.",
  showRetryButton = true,
  showHomeButton = true,
  onRetry,
  customAction,
}: Error500Props) => {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-orange-100 p-6 dark:bg-orange-900/20">
            <ServerCrash className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            500
          </h1>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {showRetryButton && <Button onClick={handleRetry}>Try Again</Button>}
          {showHomeButton && (
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          )}
          {customAction && (
            <Button variant="secondary" onClick={customAction.onClick}>
              {customAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
