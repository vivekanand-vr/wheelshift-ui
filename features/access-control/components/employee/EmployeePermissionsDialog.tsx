"use client";

import { useState } from "react";
import type { Employee } from "@/types";
import type { Permission } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserCircle,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Shield,
  UserCheck,
} from "lucide-react";
import { useEmployeeCustomPermissions } from "../../hooks/useEmployeeCustomPermissions";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPermissionDialog } from "./AddPermissionDialog";

interface EmployeePermissionsDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

export function EmployeePermissionsDialog({
  open,
  onClose,
  employee,
}: EmployeePermissionsDialogProps) {
  const [showManageDialog, setShowManageDialog] = useState(false);

  const {
    customPermissions,
    employeeAllPermissions,
    customPermissionsLoading,
    employeeAllPermissionsLoading,
    isAssigning,
    isRemoving,
    handleAssignPermission,
    handleRemovePermission,
  } = useEmployeeCustomPermissions(employee.id);

  // Get custom permission IDs for quick lookup
  const customPermissionIds = new Set(
    customPermissions.map((ep) => ep.permissionId)
  );

  const handleTogglePermission = async (
    permission: Permission,
    isChecked: boolean
  ) => {
    if (isChecked) {
      await handleAssignPermission(employee, permission.id, "");
    } else {
      await handleRemovePermission(employee, permission.id);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col p-0">
          <DialogHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
                  <UserCircle className="h-8 w-8" />
                </div>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold">
                  {employee.name}
                </DialogTitle>
                <div className="mt-1 flex flex-wrap gap-2 text-sm">
                  {employee.email && (
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {employee.email}
                    </div>
                  )}
                  {employee.phone && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {employee.phone}
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {employee.department && (
                    <Badge variant="secondary" className="text-xs">
                      <Building2 className="mr-1 h-3 w-3" />
                      {employee.department}
                    </Badge>
                  )}
                  {employee.position && (
                    <Badge variant="outline" className="text-xs">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {employee.position}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Employee Permissions</h3>
                <p className="text-muted-foreground text-sm">
                  {employeeAllPermissions.length} total permission(s) ·{" "}
                  {customPermissions.length} custom
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowManageDialog(true)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Permissions
                </Button>
              </div>
            </div>

            {customPermissionsLoading || employeeAllPermissionsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : employeeAllPermissions.length === 0 ? (
              <div className="border-muted bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <Shield className="text-muted-foreground mb-2 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  No permissions assigned
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Click &ldquo;Add Permission&rdquo; to assign custom
                  permissions
                </p>
              </div>
            ) : (
              <ScrollArea className="h-100 pr-4">
                <div className="space-y-2">
                  {employeeAllPermissions.map((permission: Permission) => {
                    const isCustom = customPermissionIds.has(permission.id);

                    return (
                      <div
                        key={permission.id}
                        className="border-muted bg-card flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          {isCustom ? (
                            <Badge variant="default" className="gap-1 text-xs">
                              <Shield className="h-3 w-3" />
                              Custom
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs"
                            >
                              <UserCheck className="h-3 w-3" />
                              Role
                            </Badge>
                          )}
                          <span className="text-sm font-medium">
                            {permission.resource}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {permission.action.charAt(0).toUpperCase() +
                              permission.action.slice(1).toLowerCase()}
                          </Badge>
                          {permission.description && (
                            <span className="text-muted-foreground truncate text-xs">
                              {permission.description}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="border-t px-6 py-4">
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <AddPermissionDialog
        open={showManageDialog}
        onClose={() => setShowManageDialog(false)}
        employee={employee}
        employeeAllPermissions={employeeAllPermissions}
        customPermissions={customPermissions}
        onTogglePermission={handleTogglePermission}
        isLoading={isAssigning || isRemoving}
      />
    </>
  );
}
