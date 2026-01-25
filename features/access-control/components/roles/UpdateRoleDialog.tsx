"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { RoleGuard } from "@/components/common/RoleGuard";
import { AlertCircle } from "lucide-react";
import type { Role, RoleRequest } from "../../types";
import { getRoleDisplay } from "../../utils";

interface UpdateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (roleId: number, data: RoleRequest) => void;
  role: Role | null;
  isLoading?: boolean;
}

type UpdateRoleDialogContentProps = Omit<UpdateRoleDialogProps, "role"> & {
  role: Role;
};

function UpdateRoleDialogContent({
  open,
  onClose,
  onSubmit,
  role,
  isLoading,
}: UpdateRoleDialogContentProps) {
  const [description, setDescription] = useState(role.description || "");

  const resetDescription = () => {
    setDescription(role.description || "");
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
    if (role) {
      onSubmit(role.id, {
        name: role.name, // Keep the same name
        description: description,
        isSystem: role.isSystem,
      });
    }
  };

  const roleDisplay = getRoleDisplay(role.name);
  const RoleIcon = roleDisplay.icon;

  // Extract base color from the color string (e.g., "text-purple-600" -> "purple")
  const colorMatch = roleDisplay.color.match(/text-(\w+)-/);
  const baseColor = colorMatch ? colorMatch[1] : "gray";
  const bgColor = `bg-${baseColor}-500/10`;
  const ringColor = `ring-${baseColor}-500/20`;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-140">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Update Role</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Info Card */}
            <Card className="border-primary/20 bg-primary/5 p-4">
              <Typography
                variant="small"
                className="text-muted-foreground mb-3"
              >
                Role Information
              </Typography>
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

            {/* Name Field (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Role Name
              </Label>
              <Input
                id="name"
                value={role.name}
                disabled
                className="bg-muted h-10 cursor-not-allowed"
              />
              <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                <Typography variant="small" className="text-yellow-700">
                  Role names cannot be changed. Only the description can be
                  updated.
                </Typography>
              </div>
            </div>

            {/* Description Field (Editable) */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the role's responsibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
              <Typography variant="small" className="text-muted-foreground">
                Provide a clear description of what this role can do
              </Typography>
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
                {isLoading ? "Updating..." : "Update Role"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}

/**
 * Update Role Dialog - SUPER_ADMIN only
 * Only allows updating role description (name cannot be changed per API)
 */
export function UpdateRoleDialog(props: UpdateRoleDialogProps) {
  if (!props.role) return null;

  return (
    <UpdateRoleDialogContent key={props.role.id} {...props} role={props.role} />
  );
}
