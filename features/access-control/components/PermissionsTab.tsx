import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { Key } from "lucide-react";
import { getResourceDisplay, getActionDisplay } from "../utils";
import type { Permission } from "../types";

interface PermissionsTabProps {
  permissionsLoading: boolean;
  groupedPermissions: Record<string, Permission[]>;
  search: string;
}

export function PermissionsTab({
  permissionsLoading,
  groupedPermissions,
  search,
}: PermissionsTabProps) {
  return (
    <TabsContent value="permissions" className="mt-0 space-y-6">
      {permissionsLoading ? (
        <Card className="bg-accent h-100 animate-pulse p-6" />
      ) : Object.keys(groupedPermissions).length === 0 ? (
        <EmptyState
          icon={<Key className="h-6 w-6" />}
          title="No permissions found"
          description={
            search
              ? "No permissions match your search criteria"
              : "Create your first permission to get started"
          }
        />
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedPermissions).map(([resource, perms]) => {
            const resourceDisplay = getResourceDisplay(resource);
            const ResourceIcon = resourceDisplay.icon;
            return (
              <Card key={resource} className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2.5 ${resourceDisplay.color.includes("blue") ? "bg-blue-500/10 ring-1 ring-blue-500/20" : resourceDisplay.color.includes("purple") ? "bg-purple-500/10 ring-1 ring-purple-500/20" : resourceDisplay.color.includes("green") ? "bg-green-500/10 ring-1 ring-green-500/20" : resourceDisplay.color.includes("orange") ? "bg-orange-500/10 ring-1 ring-orange-500/20" : "bg-gray-500/10 ring-1 ring-gray-500/20"}`}
                  >
                    <ResourceIcon
                      className={`h-5 w-5 ${resourceDisplay.color}`}
                    />
                  </div>
                  <Typography
                    variant="h3"
                    className={`font-semibold ${resourceDisplay.color}`}
                  >
                    {resourceDisplay.label}
                  </Typography>
                  <Badge variant="secondary" className="ml-auto">
                    {perms.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {perms.map((permission) => {
                    const actionDisplay = getActionDisplay(permission.action);
                    const ActionIcon = actionDisplay.icon;
                    return (
                      <div
                        key={permission.id}
                        className="hover:bg-accent hover:border-primary/50 rounded-xl border p-4 transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <ActionIcon className="h-4 w-4" />
                          <Typography
                            variant="small"
                            className="text-base font-bold"
                          >
                            {actionDisplay.label}
                          </Typography>
                        </div>
                        {permission.description && (
                          <Typography
                            variant="small"
                            className="text-muted-foreground line-clamp-2 text-sm leading-relaxed"
                          >
                            {permission.description}
                          </Typography>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
