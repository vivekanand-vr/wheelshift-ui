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
  MapPin,
  Building2,
  UserCheck,
  Check,
  X,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { EmployeeDataScope, ScopeType } from "../../types";

interface DeleteDataScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (scopeId: number) => void;
  scope: EmployeeDataScope | null;
  isLoading?: boolean;
}

const SCOPE_TYPE_ICONS: Record<ScopeType, LucideIcon> = {
  LOCATION: MapPin,
  DEPARTMENT: Building2,
  ASSIGNMENT: UserCheck,
};

/**
 * Delete Data Scope Dialog - ADMIN/SUPER_ADMIN only
 * Deletes a data scope restriction with confirmation
 */
export function DeleteDataScopeDialog({
  open,
  onClose,
  onConfirm,
  scope,
  isLoading,
}: DeleteDataScopeDialogProps) {
  const handleConfirm = () => {
    if (scope) {
      onConfirm(scope.id);
    }
  };

  if (!scope) return null;

  const Icon = SCOPE_TYPE_ICONS[scope.scopeType];

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Data Scope
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this data scope restriction?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Scope Details */}
            <Card className="bg-muted/50 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{scope.scopeType}</Badge>
                      <span className="text-sm font-medium">
                        {scope.scopeValue}
                      </span>
                      <Badge
                        variant={
                          scope.effect === "INCLUDE" ? "default" : "destructive"
                        }
                        className="ml-auto"
                      >
                        {scope.effect === "INCLUDE" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <X className="mr-1 h-3 w-3" />
                        )}
                        {scope.effect}
                      </Badge>
                    </div>
                    {scope.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {scope.description}
                      </p>
                    )}
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
                    Removing this scope will immediately expand the employee
                    `&apos;`s data access. The employee will gain access to
                    resources that were previously restricted.
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
              {isLoading ? "Deleting..." : "Delete Scope"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
