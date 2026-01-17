"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Error403Props {
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
 * 403 Forbidden Error Page
 * Used when user doesn't have permission to access a resource
 */
export const Error403 = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource. Please contact your administrator if you believe this is an error.",
  showBackButton = true,
  showHomeButton = true,
  customAction,
}: Error403Props) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
            <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            403
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
