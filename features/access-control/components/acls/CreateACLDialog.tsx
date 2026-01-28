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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Shield, Info } from "lucide-react";
import type {
  ResourceACLRequest,
  ResourceType,
  SubjectType,
  AccessLevel,
} from "../../types";
import { Typography } from "@/components/ui/typography";
import {
  RESOURCE_TYPES,
  SUBJECT_TYPES,
  ACCESS_LEVELS,
  ACCESS_LEVEL_ICONS,
  ACCESS_LEVEL_DESCRIPTIONS,
  SUBJECT_TYPE_ICONS,
  SUBJECT_TYPE_DESCRIPTIONS,
} from "../../constants/aclConstants";

interface CreateACLDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    resourceType: ResourceType,
    resourceId: number,
    data: Omit<ResourceACLRequest, "resourceType" | "resourceId">
  ) => void;
  isLoading?: boolean;
}

/**
 * Create ACL Dialog - SUPER_ADMIN only
 * Creates a new resource access control entry
 */
export function CreateACLDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: CreateACLDialogProps) {
  const [resourceType, setResourceType] = useState<ResourceType>("CAR");
  const [resourceId, setResourceId] = useState<string>("");
  const [formData, setFormData] = useState<
    Omit<ResourceACLRequest, "resourceType" | "resourceId">
  >({
    subjectType: "EMPLOYEE",
    subjectId: 0,
    accessLevel: "READ",
  });

  const resetForm = () => {
    setResourceType("CAR");
    setResourceId("");
    setFormData({
      subjectType: "EMPLOYEE",
      subjectId: 0,
      accessLevel: "READ",
    });
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedResourceId = parseInt(resourceId);
    if (!isNaN(parsedResourceId) && formData.subjectId > 0) {
      onSubmit(resourceType, parsedResourceId, formData);
    }
  };
  const SubjectIcon = SUBJECT_TYPE_ICONS[formData.subjectType];

  const isFormValid =
    resourceId && !isNaN(parseInt(resourceId)) && formData.subjectId > 0;

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>Create ACL Entry</DialogTitle>
            <DialogDescription>
              Grant specific access to a resource for an employee, role, or
              department
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info Card */}
            <Card className="border-blue-500/20 bg-blue-500/10 p-3">
              <div className="flex items-start gap-2.5">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Creating a new ACL entry
                  </p>
                  <p className="mt-0.5 text-xs text-blue-800 dark:text-blue-200">
                    This will grant specific permissions to access a resource.
                    Choose the resource, subject, and access level carefully.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Resource Access Control
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    ACL entries grant specific access to individual resources.
                    Use this for fine-grained access control beyond role-based
                    permissions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Resource Section */}
            <div className="grid grid-cols-2 gap-3">
              {/* Resource Type */}
              <div className="space-y-1.5">
                <Label htmlFor="resourceType">
                  Resource Type{" "}
                  <Typography variant="small" className="text-destructive">
                    *
                  </Typography>
                </Label>
                <Select
                  value={resourceType}
                  onValueChange={(value: ResourceType) =>
                    setResourceType(value)
                  }
                >
                  <SelectTrigger id="resourceType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resource ID */}
              <div className="space-y-1.5">
                <Label htmlFor="resourceId">
                  ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="resourceId"
                  type="number"
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  placeholder="e.g., 123"
                  required
                />
              </div>
            </div>

            {/* Subject Section */}
            <div className="grid grid-cols-2 gap-3">
              {/* Subject Type */}
              <div className="space-y-1.5">
                <Label htmlFor="subjectType">
                  Subject Type{" "}
                  <Typography variant="small" className="text-destructive">
                    *
                  </Typography>
                </Label>
                <Select
                  value={formData.subjectType}
                  onValueChange={(value: SubjectType) =>
                    setFormData({
                      ...formData,
                      subjectType: value,
                      subjectId: 0,
                    })
                  }
                >
                  <SelectTrigger id="subjectType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_TYPES.map((type) => {
                      const Icon = SUBJECT_TYPE_ICONS[type];
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
                <Typography
                  variant="extraSmall"
                  className="text-muted-foreground mt-1"
                >
                  {SUBJECT_TYPE_DESCRIPTIONS[formData.subjectType]}
                </Typography>
              </div>

              {/* Subject ID */}
              <div className="space-y-1.5">
                <Label htmlFor="subjectId">
                  Subject ID <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="subjectId"
                    type="number"
                    value={formData.subjectId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjectId: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="ID"
                    required
                  />
                  <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
                    <SubjectIcon className="text-muted-foreground h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Access Level */}
            <div className="space-y-1.5">
              <Label htmlFor="access">
                Access Level <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-row items-center space-x-2">
                <Select
                  value={formData.accessLevel}
                  onValueChange={(value: AccessLevel) =>
                    setFormData({ ...formData, accessLevel: value })
                  }
                >
                  <SelectTrigger id="access" className="w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map((level) => {
                      const Icon = ACCESS_LEVEL_ICONS[level];
                      return (
                        <SelectItem key={level} value={level}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{level}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <Typography
                      variant="small"
                      className="font-medium text-yellow-200"
                    >
                      *
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {ACCESS_LEVEL_DESCRIPTIONS[formData.accessLevel]}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !isFormValid}>
                {isLoading ? "Creating..." : "Create ACL Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
