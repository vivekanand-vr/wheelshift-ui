import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Typography } from "@/components/ui/typography";

export default function SettingsPage() {
  return (
    <Container>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage application settings"
        />

        <div className="flex min-h-100 items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="text-center">
            <Typography variant="h2" className="mb-2">
              Settings Content
            </Typography>
            <Typography variant="muted">
              Application settings will appear here
            </Typography>
          </div>
        </div>
      </div>
    </Container>
  );
}
