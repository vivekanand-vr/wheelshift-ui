import { RoleGuard } from "@/components/common";
import { RolesFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles | Access Control",
  description: "Manage roles and permissions",
};

export default function RolesPage() {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]} showErrorPage={true}>
      <RolesFeature />
    </RoleGuard>
  );
}
