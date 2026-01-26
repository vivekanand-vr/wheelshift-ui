"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFeature } from "@/features/auth";
import { useAuth } from "@/features/auth";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-600 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginFeature />;
  }

  // Return null while redirecting
  return null;
}
