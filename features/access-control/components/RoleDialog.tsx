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
import { Switch } from "@/components/ui/switch";
import type { Role, RoleRequest } from "../types";

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleRequest) => void;
  role?: Role | null;
  isLoading?: boolean;
  isSuperAdmin?: boolean;
}

export function RoleDialog({
  open,
  onClose,
  onSubmit,
  role,
  isLoading,
  isSuperAdmin,
}: RoleDialogProps) {
  const [formData, setFormData] = useState<RoleRequest>({
    name: role?.name || "",
    description: role?.description || "",
    isSystem: role?.isSystem || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!role;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Role Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., INVENTORY_MANAGER"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value.toUpperCase() })
              }
              required
              disabled={isEditing && role?.isSystem}
              className="h-10"
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Use uppercase with underscores (e.g., STORE_MANAGER)
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

          {isSuperAdmin && !isEditing && (
            <div className="bg-muted/50 flex items-center justify-between rounded-xl border p-4">
              <div className="space-y-1">
                <Label
                  htmlFor="isSystem"
                  className="cursor-pointer text-sm font-medium"
                >
                  System Role
                </Label>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  System roles cannot be deleted
                </p>
              </div>
              <Switch
                id="isSystem"
                checked={formData.isSystem}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isSystem: checked })
                }
              />
            </div>
          )}

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
              {isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Role"
                  : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
