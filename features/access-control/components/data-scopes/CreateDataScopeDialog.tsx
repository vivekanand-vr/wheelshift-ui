"use client";

import { useState, useCallback } from "react";
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
  MapPin,
  Building2,
  UserCheck,
  Check,
  X,
  type LucideIcon,
  Info,
} from "lucide-react";
import type { DataScopeRequest, ScopeType, ScopeEffect } from "../../types";
import type { Employee } from "@/types";
import { Typography } from "@/components/ui/typography";

interface CreateDataScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DataScopeRequest) => void;
  employee?: Employee;
  employeeId: number;
  isLoading?: boolean;
}

const SCOPE_TYPES: ScopeType[] = ["LOCATION", "DEPARTMENT", "ASSIGNMENT"];
const SCOPE_EFFECTS: ScopeEffect[] = ["INCLUDE", "EXCLUDE"];

const SCOPE_TYPE_ICONS: Record<ScopeType, LucideIcon> = {
  LOCATION: MapPin,
  DEPARTMENT: Building2,
  ASSIGNMENT: UserCheck,
};

const SCOPE_TYPE_DESCRIPTIONS: Record<ScopeType, string> = {
  LOCATION: "Restrict access to specific storage locations",
  DEPARTMENT: "Restrict access to department-specific resources",
  ASSIGNMENT: "Restrict access to assigned resources only",
};

const EXAMPLE_VALUES: Record<ScopeType, string[]> = {
  LOCATION: [
    "LOC-001",
    "LOC-002",
    "LOC-003",
    "MAIN_WAREHOUSE",
    "DOWNTOWN_SHOWROOM",
  ],
  DEPARTMENT: ["SALES", "FINANCE", "OPERATIONS", "INSPECTION", "ADMIN"],
  ASSIGNMENT: ["SELF", "TEAM", "ALL"],
};

/**
 * Create Data Scope Dialog - ADMIN/SUPER_ADMIN only
 * Creates a new data scope restriction for an employee
 */
export function CreateDataScopeDialog({
  open,
  onClose,
  onSubmit,
  employee,
  employeeId,
  isLoading,
}: CreateDataScopeDialogProps) {
  type FormState = Omit<DataScopeRequest, "employeeId">;

  const createInitialFormState = useCallback(
    (): FormState => ({
      scopeType: "LOCATION",
      scopeValue: "",
      effect: "INCLUDE",
      description: "",
    }),
    []
  );

  const [formData, setFormData] = useState<FormState>(createInitialFormState);
  const resolvedEmployeeId = employeeId ?? employee?.id ?? 0;

  const resetForm = useCallback(() => {
    setFormData(createInitialFormState());
  }, [createInitialFormState]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, employeeId: resolvedEmployeeId });
  };

  const selectedIcon = SCOPE_TYPE_ICONS[formData.scopeType];
  const SelectedIcon = selectedIcon;

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>Create Data Scope</DialogTitle>
            <DialogDescription>
              {employee
                ? `Add a data scope restriction for ${employee.name}`
                : "Add a data scope restriction for an employee"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Info */}
            {employee && (
              <Card className="bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <UserCheck className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {employee.email}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Scope Type */}
            <div className="space-y-2">
              <Label htmlFor="scopeType">
                Scope Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.scopeType}
                onValueChange={(value: ScopeType) =>
                  setFormData({ ...formData, scopeType: value, scopeValue: "" })
                }
              >
                <SelectTrigger id="scopeType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCOPE_TYPES.map((type) => {
                    const Icon = SCOPE_TYPE_ICONS[type];
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Typography variant="muted" className="text-xs">
                {SCOPE_TYPE_DESCRIPTIONS[formData.scopeType]}
              </Typography>
            </div>

            {/* Scope Value */}
            <div className="space-y-2">
              <Label htmlFor="scopeValue">
                Scope Value <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="scopeValue"
                    value={formData.scopeValue}
                    onChange={(e) =>
                      setFormData({ ...formData, scopeValue: e.target.value })
                    }
                    placeholder={`Enter ${formData.scopeType.toLowerCase()} value`}
                    required
                  />
                </div>
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md border">
                  <SelectedIcon className="text-muted-foreground h-4 w-4" />
                </div>
              </div>
              <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs text-blue-900 dark:text-blue-100">
                    <p className="mb-1 font-medium">Example values:</p>
                    <div className="flex flex-wrap gap-1">
                      {EXAMPLE_VALUES[formData.scopeType].map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-500/20"
                          onClick={() =>
                            setFormData({ ...formData, scopeValue: example })
                          }
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Why is this scope restriction needed?"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || !formData.scopeValue || !resolvedEmployeeId
                }
              >
                {isLoading ? "Creating..." : "Create Scope"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
