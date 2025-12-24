"use client";

import { DashboardContainer } from "@/features/dashboard";
import { Container, PageHeader } from "@/components/common";

export default function DashboardPage() {
  return (
    <Container>
      <PageHeader
        title="Dashboard"
        description="Overview of your activities and metrics"
      />
      <DashboardContainer />
    </Container>
  );
}
