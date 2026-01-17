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
import type { PermissionRequest } from "../types";

const RESOURCES = [
  "cars",
  "car-models",
  "clients",
  "employees",
  "inquiries",
  "reservations",
  "sales",
  "transactions",
  "inspections",
  "locations",
  "tasks",
  "events",
  "roles",
  "permissions",
  "acl",
  "notifications",
];

const ACTIONS = ["read", "write", "delete", "*"];

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PermissionRequest) => void;
  isLoading?: boolean;
}

export function PermissionDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: PermissionDialogProps) {
  const [formData, setFormData] = useState<PermissionRequest>({
    resource: "",
    action: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New Permission</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Resource *</Label>
            <Select
              value={formData.resource}
              onValueChange={(value) =>
                setFormData({ ...formData, resource: value })
              }
              required
            >
              <SelectTrigger id="resource">
                <SelectValue placeholder="Select a resource" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCES.map((resource) => (
                  <SelectItem key={resource} value={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action *</Label>
            <Select
              value={formData.action}
              onValueChange={(value) =>
                setFormData({ ...formData, action: value })
              }
              required
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.resource && formData.action && (
            <div className="bg-accent rounded-lg p-3">
              <Label className="text-muted-foreground text-xs">
                Permission Name (auto-generated)
              </Label>
              <p className="font-mono text-sm font-semibold">
                {formData.resource}:{formData.action}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this permission allows..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Permission"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
