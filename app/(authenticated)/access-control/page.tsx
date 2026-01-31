import { redirect } from "next/navigation";

export default function AccessControlPage() {
  // Redirect to the roles page by default
  redirect("/access-control/roles");
}
