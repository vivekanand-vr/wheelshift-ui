"use client";

import { useState } from "react";
import type { Employee } from "@/types";
import type { Permission, EmployeePermission } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Shield, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "../../api/queries";
import { formatResourceName } from "../../utils";

interface AddPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  employeeAllPermissions: Permission[];
  customPermissions: EmployeePermission[];
  onTogglePermission: (
    permission: Permission,
    isChecked: boolean
  ) => Promise<void>;
  isLoading: boolean;
}

export function AddPermissionDialog({
  open,
  onClose,
  employee,
  employeeAllPermissions,
  customPermissions,
  onTogglePermission,
  isLoading,
}: AddPermissionDialogProps) {
  const [search, setSearch] = useState("");
  const { data: allPermissions = [], isLoading: allPermissionsLoading } =
    usePermissions();

  // Get permission IDs for role-based and custom permissions
  const customPermissionIds = new Set(
    customPermissions.map((ep) => ep.permissionId)
  );
  const employeeAllPermissionIds = new Set(
    employeeAllPermissions.map((p) => p.id)
  );
  const roleBasedPermissionIds = new Set(
    employeeAllPermissions
      .filter((p) => !customPermissionIds.has(p.id))
      .map((p) => p.id)
  );

  // Filter permissions based on search
  const filteredPermissions = allPermissions.filter(
    (permission) =>
      search === "" ||
      permission.name.toLowerCase().includes(search.toLowerCase()) ||
      permission.resource.toLowerCase().includes(search.toLowerCase()) ||
      permission.action.toLowerCase().includes(search.toLowerCase()) ||
      (permission.description?.toLowerCase().includes(search.toLowerCase()) ??
        false)
  );

  // Categorize permissions
  const roleBasedPermissions = filteredPermissions.filter((p) =>
    roleBasedPermissionIds.has(p.id)
  );
  const customPermissionsFiltered = filteredPermissions.filter((p) =>
    customPermissionIds.has(p.id)
  );
  const availablePermissions = filteredPermissions.filter(
    (p) => !employeeAllPermissionIds.has(p.id) && !customPermissionIds.has(p.id)
  );

  const handleToggle = async (permission: Permission, isChecked: boolean) => {
    await onTogglePermission(permission, isChecked);
  };

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Permissions - {employee.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search permissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Separator />

          {/* Permissions List */}
          {allPermissionsLoading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-6 pr-4">
                {/* Role-Based Permissions */}
                {roleBasedPermissions.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      <h3 className="text-sm font-semibold">
                        From Roles ({roleBasedPermissions.length})
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        Cannot be removed
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {roleBasedPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="border-muted bg-muted/30 flex items-center gap-3 rounded-lg border p-3"
                        >
                          <Checkbox checked disabled className="shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {formatResourceName(permission.resource)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {permission.action.charAt(0).toUpperCase() +
                                  permission.action.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            {permission.description && (
                              <p className="text-muted-foreground mt-1 truncate text-xs">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Permissions */}
                {customPermissionsFiltered.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Shield className="text-primary h-4 w-4" />
                      <h3 className="text-sm font-semibold">
                        Custom Permissions ({customPermissionsFiltered.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {customPermissionsFiltered.map((permission) => (
                        <div
                          key={permission.id}
                          className="border-muted hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                        >
                          <Checkbox
                            checked
                            disabled={isLoading}
                            onCheckedChange={(checked) =>
                              handleToggle(permission, checked as boolean)
                            }
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {formatResourceName(permission.resource)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {permission.action.charAt(0).toUpperCase() +
                                  permission.action.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            {permission.description && (
                              <p className="text-muted-foreground mt-1 truncate text-xs">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Permissions */}
                {availablePermissions.length > 0 && (
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold">
                        Available Permissions ({availablePermissions.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="border-muted hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                        >
                          <Checkbox
                            checked={false}
                            disabled={isLoading}
                            onCheckedChange={(checked) =>
                              handleToggle(permission, checked as boolean)
                            }
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {formatResourceName(permission.resource)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {permission.action.charAt(0).toUpperCase() +
                                  permission.action.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            {permission.description && (
                              <p className="text-muted-foreground mt-1 truncate text-xs">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredPermissions.length === 0 && (
                  <div className="border-muted bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <Shield className="text-muted-foreground mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      No permissions found
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
