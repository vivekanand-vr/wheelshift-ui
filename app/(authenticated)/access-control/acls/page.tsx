import { ACLsFeature } from "@/features/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Control Lists | Access Control",
  description: "Manage resource-level access control",
};

export default function ACLsPage() {
  return <ACLsFeature />;
}
