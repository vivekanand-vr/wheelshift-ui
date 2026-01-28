"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { RoleGuard } from "@/components/common/RoleGuard";
import {
  Trash2,
  Calendar,
  User as UserIcon,
  Edit,
  Eye,
  Shield,
  Building2,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AccessLevel, ResourceACL, SubjectType } from "../../types";
import { getAccessColor, getSubjectColor, formatDateTime } from "../../utils";

interface ACLEntryProps {
  acl: ResourceACL;
  onDelete: (acl: ResourceACL) => void;
  isDeleting?: boolean;
}

const accessIconMap: Record<AccessLevel, LucideIcon> = {
  READ: Eye,
  WRITE: Edit,
  ADMIN: Shield,
};

const subjectIconMap: Record<SubjectType, LucideIcon> = {
  EMPLOYEE: User,
  ROLE: Users,
  DEPARTMENT: Building2,
};

export function ACLEntry({ acl, onDelete, isDeleting }: ACLEntryProps) {
  const accessColor = getAccessColor(acl.access);
  const subjectColor = getSubjectColor(acl.subjectType);
  const AccessIcon = accessIconMap[acl.access] ?? Eye;
  const SubjectIcon = subjectIconMap[acl.subjectType] ?? User;

  return (
    <Card className="border-border/50 p-5 transition-all hover:shadow-lg">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`shrink-0 rounded-lg p-2 ${
                acl.access === "READ"
                  ? "bg-blue-500/10"
                  : acl.access === "WRITE"
                    ? "bg-orange-500/10"
                    : "bg-red-500/10"
              }`}
            >
              {<AccessIcon className={`h-5 w-5 ${accessColor}`} />}
            </div>
            <div>
              <Typography variant="p" className="text-base font-semibold">
                {acl.subjectType}
              </Typography>
              <Badge
                variant={
                  acl.access === "READ"
                    ? "outline"
                    : acl.access === "WRITE"
                      ? "default"
                      : "destructive"
                }
                className="mt-1 text-xs font-medium"
              >
                {acl.access}
              </Badge>
            </div>
          </div>

          <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(acl)}
              disabled={isDeleting}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </RoleGuard>
        </div>

        {/* Details Section */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center gap-2">
            {<SubjectIcon className={`h-4 w-4 ${subjectColor}`} />}
            <Typography variant="small" className="text-muted-foreground">
              Subject ID:
            </Typography>
            <Badge variant="secondary" className="font-mono text-xs">
              {acl.subjectId}
            </Badge>
          </div>

          {acl.grantedBy && (
            <div className="flex items-center gap-2">
              <UserIcon className="text-muted-foreground h-4 w-4" />
              <Typography variant="small" className="text-muted-foreground">
                Granted By:
              </Typography>
              <Badge variant="secondary" className="font-mono text-xs">
                {acl.grantedBy}
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <Typography variant="small" className="text-muted-foreground">
              Created:
            </Typography>
            <Typography variant="small" className="font-medium">
              {formatDateTime(acl.createdAt)}
            </Typography>
          </div>

          {acl.reason && (
            <div className="bg-muted/50 mt-3 rounded-md p-3">
              <Typography
                variant="small"
                className="text-muted-foreground mb-1 font-medium"
              >
                Reason:
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {acl.reason}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
