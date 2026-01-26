import { RolesFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles | Access Control",
  description: "Manage roles and permissions",
};

export default function RolesPage() {
  return <RolesFeature />;
}
