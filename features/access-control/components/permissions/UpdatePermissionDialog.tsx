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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { RoleGuard } from "@/components/common/RoleGuard";
import { AlertCircle } from "lucide-react";
import type { Permission, PermissionRequest } from "../../types";
import { getResourceDisplay, getActionDisplay } from "../../utils/mappings";

interface UpdatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (permissionId: number, data: PermissionRequest) => void;
  permission: Permission | null;
  isLoading?: boolean;
}

type UpdatePermissionDialogContentProps = Omit<
  UpdatePermissionDialogProps,
  "permission"
> & {
  permission: Permission;
};

function UpdatePermissionDialogContent({
  open,
  onClose,
  onSubmit,
  permission,
  isLoading,
}: UpdatePermissionDialogContentProps) {
  const [description, setDescription] = useState(permission.description || "");

  const resetDescription = () => {
    setDescription(permission.description || "");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetDescription();
      onClose();
      return;
    }

    resetDescription();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permission) return;

    onSubmit(permission.id, {
      resource: permission.resource,
      action: permission.action,
      description,
    });
  };

  const resourceDisplay = getResourceDisplay(permission.resource);
  const actionDisplay = getActionDisplay(permission.action);
  const ResourceIcon = resourceDisplay.icon;
  const ActionIcon = actionDisplay.icon;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-140">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Update Permission</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Permission Info Card */}
            <Card className="border-primary/20 bg-primary/5 p-4">
              <Typography
                variant="small"
                className="text-muted-foreground mb-3"
              >
                Permission Information
              </Typography>
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
                  <Label className="text-muted-foreground text-xs">
                    Permission Name
                  </Label>
                  <div className="mt-1 font-mono text-sm font-semibold">
                    {permission.name}
                  </div>
                </div>
              </div>
            </Card>

            {/* Warning about immutable fields */}
            <Card className="border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
                <div className="space-y-1">
                  <Typography variant="small" className="font-medium">
                    Resource and action cannot be changed
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-xs"
                  >
                    Only the description can be updated. Create a new permission
                    if you need different resource/action combination.
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Read-only Resource Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resource</Label>
              <Input
                value={resourceDisplay.label}
                disabled
                className="bg-muted h-10 cursor-not-allowed"
              />
            </div>

            {/* Read-only Action Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Action</Label>
              <Input
                value={actionDisplay.label}
                disabled
                className="bg-muted h-10 cursor-not-allowed"
              />
            </div>

            {/* Editable Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this permission allows..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
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
              <Button type="submit" disabled={isLoading} className="min-w-25">
                {isLoading ? "Updating..." : "Update Permission"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}

/**
 * Update Permission Dialog - SUPER_ADMIN only
 * Only description can be updated (resource and action are immutable)
 */
export function UpdatePermissionDialog(props: UpdatePermissionDialogProps) {
  if (!props.permission) return null;

  return (
    <UpdatePermissionDialogContent
      key={props.permission.id}
      {...props}
      permission={props.permission}
    />
  );
}
