"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { Search } from "lucide-react";
import type { Role, Permission } from "../types";
import { getResourceDisplay, getActionDisplay } from "../utils";

interface PermissionManagerProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  availablePermissions: Permission[];
  onAddPermission: (roleId: number, permissionId: number) => void;
  onRemovePermission: (roleId: number, permissionId: number) => void;
  isLoading?: boolean;
}

export function PermissionManager({
  open,
  onClose,
  role,
  availablePermissions,
  onAddPermission,
  onRemovePermission,
  isLoading,
}: PermissionManagerProps) {
  const [search, setSearch] = useState("");

  if (!role) return null;

  const rolePermissionIds = new Set(role.permissions?.map((p) => p.id) || []);

  const filteredPermissions = availablePermissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(search.toLowerCase()) ||
      permission.resource.toLowerCase().includes(search.toLowerCase()) ||
      permission.action.toLowerCase().includes(search.toLowerCase())
  );

  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  const handleTogglePermission = (permission: Permission) => {
    if (rolePermissionIds.has(permission.id)) {
      onRemovePermission(role.id, permission.id);
    } else {
      onAddPermission(role.id, permission.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col p-0">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">
            Manage Permissions - {role.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden px-6">
          {/* Search */}
          <div className="relative shrink-0 py-4">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search permissions by resource or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9"
            />
          </div>

          {/* Available Permissions List */}
          <div className="flex flex-1 flex-col overflow-hidden pt-2">
            <Typography
              variant="small"
              className="mb-3 shrink-0 text-sm font-semibold"
            >
              All Permissions ({filteredPermissions.length})
              <Badge variant="secondary" className="ml-2">
                {role.permissions?.length || 0} selected
              </Badge>
            </Typography>
            <ScrollArea className="-mx-6 flex-1 px-6">
              <div className="space-y-6 pr-4 pb-4">
                {Object.keys(groupedPermissions).length === 0 ? (
                  <div className="py-12 text-center">
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      No permissions found `&quot;`{search}`&quot;`
                    </Typography>
                  </div>
                ) : (
                  Object.entries(groupedPermissions).map(
                    ([resource, permissions]) => {
                      const resourceDisplay = getResourceDisplay(resource);
                      const ResourceIcon = resourceDisplay.icon;
                      return (
                        <div key={resource} className="space-y-3">
                          <div className="bg-background sticky top-0 flex items-center gap-2 py-2">
                            <div
                              className={`rounded-lg p-1.5 ${resourceDisplay.color.includes("blue") ? "bg-blue-500/10 ring-1 ring-blue-500/20" : resourceDisplay.color.includes("purple") ? "bg-purple-500/10 ring-1 ring-purple-500/20" : resourceDisplay.color.includes("green") ? "bg-green-500/10 ring-1 ring-green-500/20" : resourceDisplay.color.includes("orange") ? "bg-orange-500/10 ring-1 ring-orange-500/20" : "bg-gray-500/10 ring-1 ring-gray-500/20"}`}
                            >
                              <ResourceIcon
                                className={`h-4 w-4 ${resourceDisplay.color}`}
                              />
                            </div>
                            <Typography
                              variant="small"
                              className={`font-semibold ${resourceDisplay.color}`}
                            >
                              {resourceDisplay.label}
                            </Typography>
                            <Badge variant="outline" className="ml-auto">
                              {permissions.length}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-8 md:grid-cols-2">
                            {permissions.map((permission) => {
                              const isAssigned = rolePermissionIds.has(
                                permission.id
                              );
                              const actionDisplay = getActionDisplay(
                                permission.action
                              );
                              const ActionIcon = actionDisplay.icon;
                              return (
                                <div
                                  key={permission.id}
                                  className={`hover:bg-accent flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${isAssigned ? "bg-primary/5 border-primary/20" : "bg-card"}`}
                                  onClick={() =>
                                    handleTogglePermission(permission)
                                  }
                                >
                                  <Checkbox
                                    checked={isAssigned}
                                    onCheckedChange={() =>
                                      handleTogglePermission(permission)
                                    }
                                    disabled={isLoading}
                                    className="mt-0.5"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                      <ActionIcon className="h-4 w-4 shrink-0" />
                                      <Typography
                                        variant="small"
                                        className="truncate text-sm font-semibold"
                                      >
                                        {actionDisplay.label}
                                      </Typography>
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
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="bg-muted/50 flex shrink-0 justify-end gap-3 border-t px-6 py-4">
          <Button onClick={onClose} className="min-w-25">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
