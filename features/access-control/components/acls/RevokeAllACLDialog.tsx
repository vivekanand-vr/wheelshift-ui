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
import { RoleGuard } from "@/components/common/RoleGuard";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import type { ResourceType } from "../../types";
import { Typography } from "@/components/ui/typography";

interface RevokeAllACLDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resourceType: ResourceType | null;
  resourceId: number | null;
  aclCount: number;
  isLoading?: boolean;
}

/**
 * Revoke All ACL Dialog - SUPER_ADMIN only
 * Removes all access control entries for a resource with confirmation
 */
export function RevokeAllACLDialog({
  open,
  onClose,
  onConfirm,
  resourceType,
  resourceId,
  aclCount,
  isLoading,
}: RevokeAllACLDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  if (!resourceType || !resourceId) return null;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Revoke All ACL Entries
            </DialogTitle>
            <DialogDescription>
              This will permanently remove all access control entries for this
              resource. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Resource Details */}
            <Card className="bg-muted/50 p-4">
              <div className="space-y-3">
                {/* Resource */}
                <div>
                  <Typography variant="muted" className="mb-1 text-xs">
                    Resource
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{resourceType}</Badge>
                    <Typography variant="small" className="font-mono">
                      {resourceId}
                    </Typography>
                  </div>
                </div>

                {/* ACL Count */}
                <div>
                  <Typography variant="muted" className="mb-1 text-xs">
                    ACL Entries to Remove
                  </Typography>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="text-destructive h-4 w-4" />
                    <Badge variant="destructive">{aclCount}</Badge>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      {aclCount === 1 ? "entry" : "entries"}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>

            {/* Warning */}
            <Card className="border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <Typography
                    variant="small"
                    className="font-medium text-red-900 dark:text-red-100"
                  >
                    This action cannot be undone
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mt-1 text-xs text-red-800 dark:text-red-200"
                  >
                    All {aclCount} access control{" "}
                    {aclCount === 1 ? "entry" : "entries"} for this resource
                    will be permanently removed. Users and roles will lose their
                    custom access permissions.
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Confirmation Message */}
            <Card className="border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="flex-1">
                  <Typography
                    variant="small"
                    className="font-medium text-amber-900 dark:text-amber-100"
                  >
                    Super Admin Action
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mt-1 text-xs text-amber-800 dark:text-amber-200"
                  >
                    This action is restricted to Super Admins only. Make sure
                    you want to remove all access controls before proceeding.
                  </Typography>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading
                ? "Removing..."
                : `Remove All ${aclCount} ${aclCount === 1 ? "Entry" : "Entries"}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
