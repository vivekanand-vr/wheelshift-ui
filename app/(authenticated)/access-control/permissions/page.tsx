import { PermissionsFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions | Access Control",
  description: "Manage system permissions",
};

export default function PermissionsPage() {
  return <PermissionsFeature />;
}
