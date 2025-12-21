import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Typography } from "@/components/ui/typography";

export default function TeamPage() {
  return (
    <Container>
      <div className="space-y-6">
        <PageHeader title="Team" description="Manage your team members" />

        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="text-center">
            <Typography variant="h2" className="mb-2">
              Team Content
            </Typography>
            <Typography variant="muted">
              Team management will appear here
            </Typography>
          </div>
        </div>
      </div>
    </Container>
  );
}
