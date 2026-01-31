"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/navigation";

interface Error404Props {
  /**
   * Custom title for the error page
   */
  title?: string;

  /**
   * Custom description for the error page
   */
  description?: string;

  /**
   * Show back button (default: true)
   */
  showBackButton?: boolean;

  /**
   * Show home button (default: true)
   */
  showHomeButton?: boolean;

  /**
   * Custom action button
   */
  customAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 404 Not Found Error Page
 * Used when a page or resource cannot be found
 */
export const Error404 = ({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.",
  showBackButton = true,
  showHomeButton = true,
  customAction,
}: Error404Props) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-900/20">
            <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <Typography variant="h1" className="text-6xl">
            404
          </Typography>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="muted">{description}</Typography>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {showBackButton && (
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={() => router.push("/dashboard")}>
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
