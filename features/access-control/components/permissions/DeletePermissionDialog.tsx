"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { RoleGuard } from "@/components/common/RoleGuard";
import { AlertTriangle } from "lucide-react";
import type { Permission } from "../../types";
import { getResourceDisplay, getActionDisplay } from "../../utils/mappings";

interface DeletePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  permission: Permission | null;
  isLoading?: boolean;
}

/**
 * Delete Permission Dialog - SUPER_ADMIN only
 * Warns about consequences and requires confirmation
 */
export function DeletePermissionDialog({
  open,
  onClose,
  onConfirm,
  permission,
  isLoading,
}: DeletePermissionDialogProps) {
  if (!permission) return null;

  const resourceDisplay = getResourceDisplay(permission.resource);
  const actionDisplay = getActionDisplay(permission.action);
  const ResourceIcon = resourceDisplay.icon;
  const ActionIcon = actionDisplay.icon;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              Delete Permission
            </DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. This will permanently delete the
              permission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Permission Info Card */}
            <Card className="border-destructive/20 bg-destructive/5 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                    <ResourceIcon
                      className={`h-4 w-4 ${resourceDisplay.color}`}
                    />
                    <span className="text-sm font-medium">
                      {resourceDisplay.label}
                    </span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <Badge
                    variant={
                      actionDisplay.variant === "destructive"
                        ? "destructive"
                        : actionDisplay.variant === "success"
                          ? "default"
                          : "outline"
                    }
                    className="gap-1"
                  >
                    <ActionIcon className="h-3 w-3" />
                    {actionDisplay.label}
                  </Badge>
                </div>
                <div>
                  <Typography variant="p" className="font-bold">
                    {permission.name}
                  </Typography>
                  {permission.description && (
                    <Typography
                      variant="small"
                      className="text-muted-foreground mt-1 text-xs"
                    >
                      {permission.description}
                    </Typography>
                  )}
                </div>
              </div>
            </Card>

            {/* Warning Card */}
            <Card className="border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
                <div className="space-y-1">
                  <Typography variant="small" className="font-medium">
                    This will affect:
                  </Typography>
                  <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-xs">
                    <li>All roles with this permission will lose access</li>
                    <li>All employees assigned this permission</li>
                    <li>Any feature protected by this permission</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-25"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="min-w-25"
            >
              {isLoading ? "Deleting..." : "Delete Permission"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
