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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Avatar } from "@/components/ui/avatar";
import {
  MapPin,
  Building2,
  UserCheck,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import type {
  DataScopeRequest,
  ScopeType,
  ScopeEffect,
  EmployeeDataScope,
} from "../types";
import type { Employee } from "@/types";

interface DataScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DataScopeRequest) => void;
  employee?: Employee;
  scope?: EmployeeDataScope | null;
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

// Example values for different scope types
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

export function DataScopeDialog({
  open,
  onClose,
  onSubmit,
  employee,
  scope,
  isLoading,
}: DataScopeDialogProps) {
  const buildDefaultFormData = () => ({
    employeeId: scope?.employeeId || employee?.id || 0,
    scopeType: scope?.scopeType || "LOCATION",
    scopeValue: scope?.scopeValue || "",
    effect: scope?.effect || "INCLUDE",
    description: scope?.description || "",
  });

  const [formData, setFormData] =
    useState<DataScopeRequest>(buildDefaultFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(buildDefaultFormData());
      onClose();
      return;
    }

    setFormData(buildDefaultFormData());
  };

  const isEditing = !!scope;
  const ScopeIcon = SCOPE_TYPE_ICONS[formData.scopeType];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Data Scope" : "Create Data Scope"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee Info */}
          {employee && (
            <Card className="border-primary/20 bg-primary/5 p-4">
              <Typography
                variant="small"
                className="text-muted-foreground mb-3"
              >
                Employee
              </Typography>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-sm font-semibold">
                    {employee.name?.charAt(0) || employee.email?.charAt(0)}
                  </div>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Typography variant="p" className="font-semibold">
                    {employee.name}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {employee.email}
                  </Typography>
                </div>
              </div>
            </Card>
          )}

          {/* Scope Type */}
          <div className="space-y-2">
            <Label htmlFor="scopeType" className="text-sm font-medium">
              Scope Type *
            </Label>
            <Select
              value={formData.scopeType}
              onValueChange={(value: ScopeType) =>
                setFormData({ ...formData, scopeType: value, scopeValue: "" })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select scope type" />
              </SelectTrigger>
              <SelectContent>
                {SCOPE_TYPES.map((type) => {
                  const Icon = SCOPE_TYPE_ICONS[type];
                  return (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="text-primary h-4 w-4" />
                        <span>{type}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Typography
              variant="small"
              className="text-muted-foreground leading-relaxed"
            >
              {SCOPE_TYPE_DESCRIPTIONS[formData.scopeType]}
            </Typography>
          </div>

          {/* Scope Value */}
          <div className="space-y-2">
            <Label htmlFor="scopeValue" className="text-sm font-medium">
              Scope Value *
            </Label>
            <Input
              id="scopeValue"
              placeholder={`e.g., ${EXAMPLE_VALUES[formData.scopeType][0]}`}
              value={formData.scopeValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scopeValue: e.target.value.toUpperCase(),
                })
              }
              required
              className="h-11"
            />
            <Typography
              variant="small"
              className="text-muted-foreground leading-relaxed"
            >
              Examples: {EXAMPLE_VALUES[formData.scopeType].join(", ")}
            </Typography>
          </div>

          {/* Effect */}
          <div className="space-y-2">
            <Label htmlFor="effect" className="text-sm font-medium">
              Effect *
            </Label>
            <Select
              value={formData.effect}
              onValueChange={(value: ScopeEffect) =>
                setFormData({ ...formData, effect: value })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select effect" />
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
            <Typography
              variant="small"
              className="text-muted-foreground leading-relaxed"
            >
              {formData.effect === "INCLUDE"
                ? "Grant access to specified scope"
                : "Deny access to specified scope"}
            </Typography>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description for this data scope..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Preview */}
          {formData.scopeValue && (
            <Card className="border-primary/20 bg-primary/5 p-4">
              <Typography
                variant="small"
                className="text-muted-foreground mb-2"
              >
                Scope Preview
              </Typography>
              <div className="flex items-center gap-3">
                <ScopeIcon className="text-primary h-5 w-5" />
                <Badge
                  variant={
                    formData.effect === "INCLUDE" ? "default" : "destructive"
                  }
                >
                  {formData.effect}
                </Badge>
                <Typography variant="p" className="font-mono">
                  {formData.scopeType}: {formData.scopeValue}
                </Typography>
              </div>
            </Card>
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
            <Button
              type="submit"
              disabled={isLoading || !formData.scopeValue}
              className="min-w-25"
            >
              {isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Scope"
                  : "Create Scope"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
