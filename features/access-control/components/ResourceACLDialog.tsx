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
import {
  Eye,
  Edit,
  Shield,
  User,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type {
  ResourceACLRequest,
  ResourceType,
  SubjectType,
  AccessLevel,
} from "../types";

interface ResourceACLDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    resourceType: ResourceType,
    resourceId: number,
    data: Omit<ResourceACLRequest, "resourceType" | "resourceId">
  ) => void;
  isLoading?: boolean;
}

const RESOURCE_TYPES: ResourceType[] = [
  "CAR",
  "CAR_MODEL",
  "CLIENT",
  "EMPLOYEE",
  "INQUIRY",
  "RESERVATION",
  "SALE",
  "TRANSACTION",
  "INSPECTION",
  "LOCATION",
  "TASK",
  "EVENT",
  "ROLE",
  "PERMISSION",
  "ACL",
  "NOTIFICATION",
];

const SUBJECT_TYPES: SubjectType[] = ["EMPLOYEE", "ROLE", "DEPARTMENT"];

const ACCESS_LEVELS: AccessLevel[] = ["READ", "WRITE", "ADMIN"];

const ACCESS_LEVEL_ICONS: Record<AccessLevel, LucideIcon> = {
  READ: Eye,
  WRITE: Edit,
  ADMIN: Shield,
};

const ACCESS_LEVEL_DESCRIPTIONS: Record<AccessLevel, string> = {
  READ: "View only access",
  WRITE: "View and modify access",
  ADMIN: "Full control including ACL management",
};

const SUBJECT_TYPE_ICONS: Record<SubjectType, LucideIcon> = {
  EMPLOYEE: User,
  ROLE: Users,
  DEPARTMENT: Building2,
};

const SUBJECT_TYPE_DESCRIPTIONS: Record<SubjectType, string> = {
  EMPLOYEE: "Grant access to a specific employee",
  ROLE: "Grant access to all employees with a role",
  DEPARTMENT: "Grant access to all employees in a department",
};

export function ResourceACLDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: ResourceACLDialogProps) {
  const [resourceType, setResourceType] = useState<ResourceType>("CAR");
  const [resourceId, setResourceId] = useState<string>("");
  const [formData, setFormData] = useState<
    Omit<ResourceACLRequest, "resourceType" | "resourceId">
  >({
    subjectType: "EMPLOYEE",
    subjectId: 0,
    access: "READ",
    reason: "",
  });

  const resetForm = () => {
    setResourceType("CAR");
    setResourceId("");
    setFormData({
      subjectType: "EMPLOYEE",
      subjectId: 0,
      access: "READ",
      reason: "",
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      onClose();
      return;
    }

    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedResourceId = parseInt(resourceId);
    if (!isNaN(parsedResourceId) && formData.subjectId > 0) {
      onSubmit(resourceType, parsedResourceId, formData);
    }
  };

  const AccessIcon = ACCESS_LEVEL_ICONS[formData.access];
  const SubjectIcon = SUBJECT_TYPE_ICONS[formData.subjectType];

  const isFormValid =
    resourceId &&
    !isNaN(parseInt(resourceId)) &&
    formData.subjectId > 0 &&
    formData.access;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Create Resource ACL</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resource Information */}
          <Card className="border-primary/20 bg-primary/5 p-4">
            <Typography variant="small" className="text-muted-foreground mb-3">
              Resource
            </Typography>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="resourceType" className="text-xs font-medium">
                  Type *
                </Label>
                <Select
                  value={resourceType}
                  onValueChange={(value: ResourceType) =>
                    setResourceType(value)
                  }
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resourceId" className="text-xs font-medium">
                  ID *
                </Label>
                <Input
                  id="resourceId"
                  type="number"
                  placeholder="e.g., 123"
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>
          </Card>

          {/* Subject Type */}
          <div className="space-y-2">
            <Label htmlFor="subjectType" className="text-sm font-medium">
              Subject Type *
            </Label>
            <Select
              value={formData.subjectType}
              onValueChange={(value: SubjectType) =>
                setFormData({ ...formData, subjectType: value })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_TYPES.map((type) => {
                  const Icon = SUBJECT_TYPE_ICONS[type];
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
              {SUBJECT_TYPE_DESCRIPTIONS[formData.subjectType]}
            </Typography>
          </div>

          {/* Subject ID */}
          <div className="space-y-2">
            <Label htmlFor="subjectId" className="text-sm font-medium">
              {formData.subjectType === "EMPLOYEE"
                ? "Employee ID"
                : formData.subjectType === "ROLE"
                  ? "Role ID"
                  : "Department ID"}{" "}
              *
            </Label>
            <Input
              id="subjectId"
              type="number"
              placeholder={`Enter ${formData.subjectType.toLowerCase()} ID`}
              value={formData.subjectId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: parseInt(e.target.value) || 0,
                })
              }
              required
              className="h-11"
            />
          </div>

          {/* Access Level */}
          <div className="space-y-2">
            <Label htmlFor="access" className="text-sm font-medium">
              Access Level *
            </Label>
            <Select
              value={formData.access}
              onValueChange={(value: AccessLevel) =>
                setFormData({ ...formData, access: value })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_LEVELS.map((level) => {
                  const Icon = ACCESS_LEVEL_ICONS[level];
                  return (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${
                            level === "READ"
                              ? "text-blue-600"
                              : level === "WRITE"
                                ? "text-orange-600"
                                : "text-red-600"
                          }`}
                        />
                        <span>{level}</span>
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
              {ACCESS_LEVEL_DESCRIPTIONS[formData.access]}
            </Typography>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Why is this access being granted?"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Preview */}
          {isFormValid && (
            <Card className="border-primary/20 bg-primary/5 p-4">
              <Typography
                variant="small"
                className="text-muted-foreground mb-2"
              >
                ACL Preview
              </Typography>
              <div className="flex flex-wrap items-center gap-2">
                <SubjectIcon className="text-primary h-5 w-5" />
                <Typography variant="small" className="font-medium">
                  {formData.subjectType} #{formData.subjectId}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  →
                </Typography>
                <AccessIcon
                  className={`h-5 w-5 ${
                    formData.access === "READ"
                      ? "text-blue-600"
                      : formData.access === "WRITE"
                        ? "text-orange-600"
                        : "text-red-600"
                  }`}
                />
                <Badge
                  variant={
                    formData.access === "READ"
                      ? "outline"
                      : formData.access === "WRITE"
                        ? "default"
                        : "destructive"
                  }
                >
                  {formData.access}
                </Badge>
                <Typography variant="small" className="text-muted-foreground">
                  →
                </Typography>
                <Typography variant="small" className="font-medium">
                  {resourceType} #{resourceId}
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
              disabled={isLoading || !isFormValid}
              className="min-w-25"
            >
              {isLoading ? "Creating..." : "Create ACL"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
