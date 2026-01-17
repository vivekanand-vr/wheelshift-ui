import { RoleGuard } from "@/components/common/RoleGuard";
import { AccessControlFeature } from "@/features/access-control";

export default function AccessControlPage() {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <AccessControlFeature />
    </RoleGuard>
  );
}
