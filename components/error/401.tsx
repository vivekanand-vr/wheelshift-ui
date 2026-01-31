"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/navigation";

interface Error401Props {
  /**
   * Custom title for the error page
   */
  title?: string;

  /**
   * Custom description for the error page
   */
  description?: string;

  /**
   * Show login button (default: true)
   */
  showLoginButton?: boolean;

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
 * 401 Unauthorized Error Page
 * Used when user needs to authenticate to access a resource
 */
export const Error401 = ({
  title = "Authentication Required",
  description = "You need to be logged in to access this resource. Please log in to continue.",
  showLoginButton = true,
  showHomeButton = false,
  customAction,
}: Error401Props) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6 dark:bg-yellow-900/20">
            <Lock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <Typography variant="h1" className="text-6xl">
            401
          </Typography>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="muted">{description}</Typography>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {showLoginButton && (
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          )}
          {showHomeButton && (
            <Button variant="outline" onClick={() => router.push("/")}>
              Go Home
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
