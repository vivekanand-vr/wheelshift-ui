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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import type { PermissionRequest, Permission } from "../../types";

const RESOURCES = [
  "cars",
  "car_models",
  "clients",
  "employees",
  "inquiries",
  "reservations",
  "sales",
  "transactions",
  "inspections",
  "storage",
  "tasks",
  "events",
  "reports",
  "settings",
  "acl",
  "audit",
] as const;

const ACTIONS = [
  "read",
  "write",
  "delete",
  "manage",
  "assign",
  "convert",
  "view",
  "export",
] as const;

interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PermissionRequest) => void;
  isLoading?: boolean;
  permissions?: Permission[];
}

/**
 * Create Permission Dialog - SUPER_ADMIN only
 * Creates a new permission with resource and action
 * Permission name is auto-generated as resource:action
 */
export function CreatePermissionDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
  permissions = [],
}: CreatePermissionDialogProps) {
  const defaultFormData = () => ({
    resource: "",
    action: "",
    description: "",
  });

  const [formData, setFormData] = useState<PermissionRequest>(defaultFormData);
  const [duplicateError, setDuplicateError] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(defaultFormData());
      setDuplicateError(false);
      onClose();
      return;
    }

    setFormData(defaultFormData());
    setDuplicateError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate permission
    const permissionName = `${formData.resource}:${formData.action}`;
    const isDuplicate = permissions.some((p) => p.name === permissionName);

    if (isDuplicate) {
      setDuplicateError(true);
      return;
    }

    onSubmit(formData);
  };

  // Generate preview of permission name
  const permissionName =
    formData.resource && formData.action
      ? `${formData.resource}:${formData.action}`
      : "";

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Create New Permission</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="resource" className="text-sm font-medium">
                Resource *
              </Label>
              <Select
                value={formData.resource}
                onValueChange={(value) =>
                  setFormData({ ...formData, resource: value })
                }
                required
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a resource..." />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCES.map((resource) => (
                    <SelectItem key={resource} value={resource}>
                      {resource
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Select the resource this permission applies to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action" className="text-sm font-medium">
                Action *
              </Label>
              <Select
                value={formData.action}
                onValueChange={(value) =>
                  setFormData({ ...formData, action: value })
                }
                required
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select an action..." />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Select the action allowed on this resource
              </p>
            </div>

            {/* Permission Name Preview */}
            {permissionName && (
              <div className="bg-muted/50 rounded-xl border p-4">
                <Label className="text-sm font-medium">
                  Permission Name (Auto-generated)
                </Label>
                <div className="mt-2 font-mono text-sm font-semibold">
                  {permissionName}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this permission allows..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="resize-none"
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
                disabled={isLoading || !formData.resource || !formData.action}
                className="min-w-25"
              >
                {isLoading ? "Creating..." : "Create Permission"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Duplicate Permission Error Dialog */}
      <ErrorDialog
        open={duplicateError}
        onClose={() => setDuplicateError(false)}
        type="info"
        title="Permission Already Exists"
        detail={`A permission with the name '${formData.resource}:${formData.action}' already exists. Please select a different resource or action combination.`}
        code="DUPLICATE_PERMISSION"
      />
    </RoleGuard>
  );
}
