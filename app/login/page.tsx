"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFeature } from "@/features/auth";
import { useAuth } from "@/features/auth";
import Loader from "@/components/common/Loader";

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
    return <Loader />;
  }

  // Only show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginFeature />;
  }

  // Return null while redirecting
  return null;
}
