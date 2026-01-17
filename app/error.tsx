"use client";

import { Error500 } from "@/components/error";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <Error500
      title="Something Went Wrong"
      description="An unexpected error occurred. Please try again or contact support if the problem persists."
      onRetry={reset}
    />
  );
}
