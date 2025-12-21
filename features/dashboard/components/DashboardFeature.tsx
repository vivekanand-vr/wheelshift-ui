"use client";

import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Typography } from "@/components/ui/typography";
import { useAuth } from "@/lib/redux/features/auth/hooks";

export function DashboardFeature() {
  const { user } = useAuth();

  return (
    <Container>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Welcome back, ${user?.name || "User"}!`}
        />

        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="text-center">
            <Typography variant="h2" className="mb-2">
              Dashboard Content
            </Typography>
            <Typography variant="muted">
              Your dashboard content will appear here
            </Typography>
          </div>
        </div>
      </div>
    </Container>
  );
}
