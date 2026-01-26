"use client";

import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ACLs } from "./acls/ACLs";

export function ACLsFeature() {
  return (
    <Container>
      <PageHeader
        title="Access Control Lists"
        description="Manage resource-level access control entries"
      />

      <div className="space-y-6">
        <ACLs />
      </div>
    </Container>
  );
}
