import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Key, MoreVertical, Edit, Trash2 } from "lucide-react";
import { getResourceDisplay, getActionDisplay } from "../../utils";
import { PermissionsTabSkeleton } from "../shimmer";
import type { Permission } from "../../types";

interface PermissionsTabProps {
  permissionsLoading: boolean;
  groupedPermissions: Record<string, Permission[]>;
  search: string;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  isSuperAdmin: boolean;
}

export function PermissionsTab({
  permissionsLoading,
  groupedPermissions,
  search,
  onEdit,
  onDelete,
  isSuperAdmin,
}: PermissionsTabProps) {
  return (
    <TabsContent value="permissions" className="mt-0 space-y-6">
      {permissionsLoading ? (
        <PermissionsTabSkeleton />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(groupedPermissions).map(([resource, perms]) => {
            const resourceDisplay = getResourceDisplay(resource);
            const ResourceIcon = resourceDisplay.icon;
            return (
              <Card
                key={resource}
                className="hover:border-primary/50 flex flex-col p-4 transition-all hover:shadow-md"
              >
                {/* Resource Header */}
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className={`rounded-lg p-2 ${resourceDisplay.color.includes("blue") ? "bg-blue-500/10 ring-1 ring-blue-500/20" : resourceDisplay.color.includes("purple") ? "bg-purple-500/10 ring-1 ring-purple-500/20" : resourceDisplay.color.includes("green") ? "bg-green-500/10 ring-1 ring-green-500/20" : resourceDisplay.color.includes("orange") ? "bg-orange-500/10 ring-1 ring-orange-500/20" : "bg-gray-500/10 ring-1 ring-gray-500/20"}`}
                  >
                    <ResourceIcon
                      className={`h-5 w-5 ${resourceDisplay.color}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-x-2">
                    <Typography
                      variant="small"
                      className={`truncate font-bold ${resourceDisplay.color}`}
                    >
                      {resourceDisplay.label}
                    </Typography>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {perms.length} Permissions
                    </Badge>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="flex-1 space-y-2">
                  {perms.map((permission) => {
                    const actionDisplay = getActionDisplay(permission.action);
                    const ActionIcon = actionDisplay.icon;
                    return (
                      <div
                        key={permission.id}
                        className="hover:bg-accent group rounded-lg border p-2.5 transition-all"
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <ActionIcon className="h-3.5 w-3.5 shrink-0" />
                          <Typography
                            variant="small"
                            className="flex-1 truncate text-sm font-semibold"
                          >
                            {actionDisplay.label}
                          </Typography>
                          {isSuperAdmin && (
                            <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 shrink-0 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => onEdit(permission)}
                                  >
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onDelete(permission)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </RoleGuard>
                          )}
                        </div>
                        {permission.description && (
                          <Typography
                            variant="small"
                            className="text-muted-foreground line-clamp-2 text-xs leading-relaxed"
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
