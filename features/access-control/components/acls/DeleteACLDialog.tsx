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
import {
  Eye,
  Edit,
  Shield,
  User,
  Users,
  Building2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { ResourceACL, AccessLevel, SubjectType } from "../../types";

interface DeleteACLDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (aclId: number) => void;
  acl: ResourceACL | null;
  isLoading?: boolean;
}

const ACCESS_LEVEL_ICONS: Record<AccessLevel, LucideIcon> = {
  READ: Eye,
  WRITE: Edit,
  ADMIN: Shield,
};

const SUBJECT_TYPE_ICONS: Record<SubjectType, LucideIcon> = {
  EMPLOYEE: User,
  ROLE: Users,
  DEPARTMENT: Building2,
};

/**
 * Delete ACL Dialog - SUPER_ADMIN only
 * Deletes a resource access control entry with confirmation
 */
export function DeleteACLDialog({
  open,
  onClose,
  onConfirm,
  acl,
  isLoading,
}: DeleteACLDialogProps) {
  const handleConfirm = () => {
    if (acl) {
      onConfirm(acl.id);
    }
  };

  if (!acl) return null;

  const AccessIcon = ACCESS_LEVEL_ICONS[acl.accessLevel];
  const SubjectIcon = SUBJECT_TYPE_ICONS[acl.subjectType];

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete ACL Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this access control entry?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* ACL Details */}
            <Card className="bg-muted/50 p-4">
              <div className="space-y-3">
                {/* Resource */}
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Resource</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{acl.resourceType}</Badge>
                    <span className="font-mono text-sm">#{acl.resourceId}</span>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Subject</p>
                  <div className="flex items-center gap-2">
                    <SubjectIcon className="text-muted-foreground h-4 w-4" />
                    <Badge variant="outline">{acl.subjectType}</Badge>
                    <span className="font-mono text-sm">#{acl.subjectId}</span>
                  </div>
                </div>

                {/* Access Level */}
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">
                    Access Level
                  </p>
                  <div className="flex items-center gap-2">
                    <AccessIcon className="text-primary h-4 w-4" />
                    <Badge
                      variant={
                        acl.accessLevel === "ADMIN"
                          ? "destructive"
                          : acl.accessLevel === "WRITE"
                            ? "default"
                            : "outline"
                      }
                    >
                      {acl.accessLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Warning */}
            <Card className="border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    This action cannot be undone
                  </p>
                  <p className="mt-1 text-xs text-red-800 dark:text-red-200">
                    Removing this ACL entry will immediately revoke the granted
                    access. The subject will lose{" "}
                    {acl.accessLevel.toLowerCase()} permissions to this
                    resource.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete ACL Entry"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
