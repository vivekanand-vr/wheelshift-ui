import { RoleGuard } from "@/components/common";
import { PermissionsFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions | Access Control",
  description: "Manage system permissions",
};

export default function PermissionsPage() {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]} showErrorPage={true}>
      <PermissionsFeature />
    </RoleGuard>
  );
}
