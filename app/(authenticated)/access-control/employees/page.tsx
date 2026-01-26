import { RoleGuard } from "@/components/common";
import { EmployeesFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | Access Control",
  description: "Manage employee access and permissions",
};

export default function EmployeesPage() {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]} showErrorPage={true}>
      <EmployeesFeature />
    </RoleGuard>
  );
}
