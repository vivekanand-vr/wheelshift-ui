import { RoleGuard } from "@/components/common/RoleGuard";
import { AccessControlFeature } from "@/features/access-control";

export default function AccessControlPage() {
  return (
    <RoleGuard
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page.
              <br />
              Only Super Admins and Admins can manage access control.
            </p>
          </div>
        </div>
      }
    >
      <AccessControlFeature />
    </RoleGuard>
  );
}
