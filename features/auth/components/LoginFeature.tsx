"use client";

import { Card } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import type { LoginFeatureProps } from "../types";

export function LoginFeature({ onSuccess }: LoginFeatureProps) {
  return (
    <div className="from-primary-50 via-background to-secondary-50 flex min-h-screen items-center justify-center bg-linear-to-br p-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <LoginForm onSuccess={onSuccess} />
      </Card>
    </div>
  );
}
