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
import {
  Eye,
  Edit,
  Shield,
  User,
  Users,
  Building2,
  Info,
  type LucideIcon,
} from "lucide-react";
import type {
  ResourceACLRequest,
  ResourceType,
  SubjectType,
  AccessLevel,
} from "../../types";

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

  const AccessIcon = ACCESS_LEVEL_ICONS[formData.accessLevel];
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <Card className="border-blue-500/20 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Resource Access Control
                  </p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                    ACL entries grant specific access to individual resources.
                    Use this for fine-grained access control beyond role-based
                    permissions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Resource Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Resource</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Resource Type */}
                <div className="space-y-2">
                  <Label htmlFor="resourceType">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={resourceType}
                    onValueChange={(value: ResourceType) =>
                      setResourceType(value)
                    }
                  >
                    <SelectTrigger id="resourceType">
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
                <div className="space-y-2">
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
            </div>

            {/* Subject Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Grant Access To</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Subject Type */}
                <div className="space-y-2">
                  <Label htmlFor="subjectType">
                    Subject Type <span className="text-destructive">*</span>
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
                    <SelectTrigger id="subjectType">
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
                  <p className="text-muted-foreground text-xs">
                    {SUBJECT_TYPE_DESCRIPTIONS[formData.subjectType]}
                  </p>
                </div>

                {/* Subject ID */}
                <div className="space-y-2">
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
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md border">
                      <SubjectIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Level */}
            <div className="space-y-2">
              <Label htmlFor="access">
                Access Level <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value: AccessLevel) =>
                  setFormData({ ...formData, accessLevel: value })
                }
              >
                <SelectTrigger id="access">
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
              <Card className="bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <AccessIcon className="text-primary h-4 w-4" />
                  <p className="text-muted-foreground text-xs">
                    {ACCESS_LEVEL_DESCRIPTIONS[formData.accessLevel]}
                  </p>
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
