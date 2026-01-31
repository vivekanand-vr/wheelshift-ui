"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { RoleGuard } from "@/components/common/RoleGuard";
import { AlertTriangle, Shield } from "lucide-react";
import type { Role } from "../../types";
import { getRoleDisplay } from "../../utils";

interface DeleteRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: Role | null;
  isLoading?: boolean;
}

/**
 * Delete Role Dialog - SUPER_ADMIN only
 * Cannot delete system roles or roles with assigned employees
 */
export function DeleteRoleDialog({
  open,
  onClose,
  onConfirm,
  role,
  isLoading,
}: DeleteRoleDialogProps) {
  if (!role) return null;

  const roleDisplay = getRoleDisplay(role.name);
  const RoleIcon = roleDisplay.icon;
  const canDelete = !role.isSystem;

  // Extract base color from the color string (e.g., "text-purple-600" -> "purple")
  const colorMatch = roleDisplay.color.match(/text-(\w+)-/);
  const baseColor = colorMatch ? colorMatch[1] : "gray";
  const bgColor = `bg-${baseColor}-500/10`;
  const ringColor = `ring-${baseColor}-500/20`;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader className="pb-4">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              Delete Role
            </DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. This will permanently delete the
              role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Role Info Card */}
            <Card className="border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${bgColor} ring-1 ${ringColor}`}
                >
                  <RoleIcon className={`h-5 w-5 ${roleDisplay.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Typography variant="p" className="font-bold">
                      {roleDisplay.label}
                    </Typography>
                    {role.isSystem && (
                      <Badge variant="secondary" className="text-xs">
                        System Role
                      </Badge>
                    )}
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    {role.permissions.length} permission
                    {role.permissions.length !== 1 ? "s" : ""}
                  </Typography>
                </div>
              </div>
            </Card>

            {/* System Role Warning */}
            {role.isSystem && (
              <Card className="border-yellow-500/20 bg-yellow-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 text-yellow-600" />
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="p"
                      className="font-semibold text-yellow-900"
                    >
                      Cannot Delete System Role
                    </Typography>
                    <Typography
                      variant="small"
                      className="mt-1 text-yellow-700"
                    >
                      System roles are protected and cannot be deleted. They are
                      essential for the application&apos;s security model.
                    </Typography>
                  </div>
                </div>
              </Card>
            )}

            {/* Delete Warning */}
            {canDelete && (
              <Card className="border-destructive/20 bg-destructive/5 p-4">
                <Typography variant="small" className="text-destructive">
                  <strong>Warning:</strong> Deleting this role will:
                </Typography>
                <ul className="text-destructive mt-2 ml-4 list-disc space-y-1 text-sm">
                  <li>Remove all permission assignments</li>
                  <li>Unassign this role from all employees</li>
                  <li>Permanently delete the role configuration</li>
                </ul>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-25"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading || !canDelete}
              className="min-w-25"
            >
              {isLoading ? "Deleting..." : "Delete Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
