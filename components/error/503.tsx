"use client";

import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/navigation";

interface Error503Props {
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
   * Retry action callback
   */
  onRetry?: () => void;

  /**
   * Estimated time until service is back
   */
  estimatedTime?: string;
}

/**
 * 503 Service Unavailable Error Page
 * Used when the service is temporarily unavailable
 */
export const Error503 = ({
  title = "Service Unavailable",
  description = "The service is temporarily unavailable due to maintenance or high load. Please try again in a few moments.",
  showRetryButton = true,
  onRetry,
  estimatedTime,
}: Error503Props) => {
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
          <div className="rounded-full bg-purple-100 p-6 dark:bg-purple-900/20">
            <CloudOff className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <Typography variant="h1" className="text-6xl">
            503
          </Typography>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="muted">{description}</Typography>
          {estimatedTime && (
            <Typography
              variant="small"
              className="font-medium text-purple-600 dark:text-purple-400"
            >
              Estimated time: {estimatedTime}
            </Typography>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          {showRetryButton && <Button onClick={handleRetry}>Try Again</Button>}
        </div>
      </div>
    </div>
  );
};
