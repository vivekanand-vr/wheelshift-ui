"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/common/RoleGuard";
import {
  AlertCircle,
  Check,
  X,
  MapPin,
  Building2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type {
  DataScopeRequest,
  ScopeEffect,
  ScopeType,
  EmployeeDataScope,
} from "../../types";
import { Typography } from "@/components/ui/typography";

interface UpdateDataScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (scopeId: number, data: DataScopeRequest) => void;
  scope: EmployeeDataScope | null;
  isLoading?: boolean;
}

const SCOPE_TYPE_ICONS: Record<ScopeType, LucideIcon> = {
  LOCATION: MapPin,
  DEPARTMENT: Building2,
  ASSIGNMENT: UserCheck,
};

const SCOPE_EFFECTS: ScopeEffect[] = ["INCLUDE", "EXCLUDE"];

function UpdateDataScopeDialogContent({
  open,
  onClose,
  onSubmit,
  scope,
  isLoading,
}: UpdateDataScopeDialogProps) {
  const buildInitialFormData = (): DataScopeRequest => ({
    employeeId: scope?.employeeId || 0,
    scopeType: scope?.scopeType || "LOCATION",
    scopeValue: scope?.scopeValue || "",
    effect: scope?.effect || "INCLUDE",
    description: scope?.description || "",
  });

  const [formData, setFormData] =
    useState<DataScopeRequest>(buildInitialFormData);

  if (!scope) return null;

  const Icon = SCOPE_TYPE_ICONS[scope.scopeType];

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(buildInitialFormData());
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scope.id, formData);
  };

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>Update Data Scope</DialogTitle>
            <DialogDescription>
              Modify the effect and description of this data scope restriction
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Scope Info Card */}
            <Card className="bg-muted/50 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{scope.scopeType}</Badge>
                      <span className="text-sm font-medium">
                        {scope.scopeValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <Typography
                    variant="small"
                    className="font-medium text-yellow-900 dark:text-yellow-100"
                  >
                    Scope type and value cannot be changed
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mt-1 text-xs text-yellow-800 dark:text-yellow-200"
                  >
                    To use a different scope type or value, delete this scope
                    and create a new one.
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Read-only Scope Type */}
            <div className="space-y-2">
              <Label>Scope Type</Label>
              <Input
                value={scope.scopeType}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Read-only Scope Value */}
            <div className="space-y-2">
              <Label>Scope Value</Label>
              <Input
                value={scope.scopeValue}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Effect */}
            <div className="space-y-2">
              <Label htmlFor="effect">
                Effect <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.effect}
                onValueChange={(value: ScopeEffect) =>
                  setFormData({ ...formData, effect: value })
                }
              >
                <SelectTrigger id="effect">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCOPE_EFFECTS.map((effect) => (
                    <SelectItem key={effect} value={effect}>
                      <div className="flex items-center gap-2">
                        {effect === "INCLUDE" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span>{effect}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Typography variant="muted" className="text-xs">
                {formData.effect === "INCLUDE"
                  ? "Whitelist: Only show resources matching this scope"
                  : "Blacklist: Hide resources matching this scope"}
              </Typography>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Why is this scope restriction needed?"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}

export function UpdateDataScopeDialog(props: UpdateDataScopeDialogProps) {
  return (
    <UpdateDataScopeDialogContent
      key={`${props.scope?.id ?? "no-scope"}-${props.open}`}
      {...props}
    />
  );
}
