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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import type { Role, RoleRequest } from "../../types";
import { Typography } from "@/components/ui/typography";

// Define fixed role enum values from backend
const AVAILABLE_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES",
  "INSPECTOR",
  "FINANCE",
  "STORE_MANAGER",
] as const;

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleRequest) => void;
  existingRoles: Role[];
  isLoading?: boolean;
}

/**
 * Create Role Dialog - SUPER_ADMIN only
 * Creates a new role with name, description, and system flag
 * Shows dropdown of predefined roles that haven't been created yet
 */
export function CreateRoleDialog({
  open,
  onClose,
  onSubmit,
  existingRoles,
  isLoading,
}: CreateRoleDialogProps) {
  const buildDefaultForm = () => ({
    name: "",
    description: "",
    isSystem: false,
  });

  const [formData, setFormData] = useState<RoleRequest>(buildDefaultForm);

  // Calculate available roles (not yet created)
  const existingRoleNames = existingRoles.map((role) => role.name);
  const availableRoles = AVAILABLE_ROLES.filter(
    (role) => !existingRoleNames.includes(role)
  );
  const allRolesCreated = availableRoles.length === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(buildDefaultForm());
      onClose();
      return;
    }

    setFormData(buildDefaultForm());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      {open && allRolesCreated ? (
        <ErrorDialog
          open={open}
          onClose={onClose}
          type="info"
          title="All Roles Already Created"
          detail="All available role types have already been created. You cannot create any more roles at this time."
        />
      ) : (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-125">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl">Create New Role</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Role Type *
                </Label>
                <Select
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a role type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Select from available predefined role types
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role's responsibilities..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="bg-muted/50 flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="isSystem"
                    className="cursor-pointer text-sm font-medium"
                  >
                    System Role
                  </Label>
                  <Typography
                    variant="muted"
                    className="text-xs leading-relaxed"
                  >
                    System roles cannot be deleted
                  </Typography>
                </div>
                <Switch
                  id="isSystem"
                  checked={formData.isSystem}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isSystem: checked })
                  }
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
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name}
                  className="min-w-25"
                >
                  {isLoading ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </RoleGuard>
  );
}
