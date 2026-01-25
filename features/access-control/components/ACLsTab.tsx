"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Eye,
  Edit,
  User,
  Users,
  Building2,
  Trash2,
} from "lucide-react";
import type { ResourceACL, SubjectType, AccessLevel } from "../types";

interface ACLsTabProps {
  acls: ResourceACL[];
  aclsLoading: boolean;
  search: string;
  filterSubjectType: SubjectType | "all";
  onFilterChange: (filter: SubjectType | "all") => void;
  onCreateACL: () => void;
  onDeleteACL: (aclId: number) => void;
  isDeleting?: boolean;
}

export function ACLsTab({
  acls,
  aclsLoading,
  search,
  filterSubjectType,
  onFilterChange,
  onCreateACL,
  onDeleteACL,
  isDeleting,
}: ACLsTabProps) {
  // Filter ACLs based on search and subject type
  const filteredACLs = acls.filter((acl) => {
    const matchesSearch =
      acl.resourceType.toLowerCase().includes(search.toLowerCase()) ||
      acl.subjectType.toLowerCase().includes(search.toLowerCase()) ||
      acl.reason?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterSubjectType === "all" || acl.subjectType === filterSubjectType;

    return matchesSearch && matchesFilter;
  });

  // Group ACLs by resource type
  const aclsByResource = filteredACLs.reduce(
    (acc, acl) => {
      const key = `${acl.resourceType}:${acl.resourceId}`;
      if (!acc[key]) {
        acc[key] = {
          resourceType: acl.resourceType,
          resourceId: acl.resourceId,
          acls: [],
        };
      }
      acc[key].acls.push(acl);
      return acc;
    },
    {} as Record<
      string,
      { resourceType: string; resourceId: number; acls: ResourceACL[] }
    >
  );

  const getAccessIcon = (level: AccessLevel) => {
    switch (level) {
      case "READ":
        return Eye;
      case "WRITE":
        return Edit;
      case "ADMIN":
        return Shield;
      default:
        return Eye;
    }
  };

  const getAccessColor = (level: AccessLevel) => {
    switch (level) {
      case "READ":
        return "text-blue-600";
      case "WRITE":
        return "text-orange-600";
      case "ADMIN":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSubjectIcon = (type: SubjectType) => {
    switch (type) {
      case "EMPLOYEE":
        return User;
      case "ROLE":
        return Users;
      case "DEPARTMENT":
        return Building2;
      default:
        return User;
    }
  };

  const getSubjectColor = (type: SubjectType) => {
    switch (type) {
      case "EMPLOYEE":
        return "text-blue-600";
      case "ROLE":
        return "text-purple-600";
      case "DEPARTMENT":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <TabsContent value="acls" className="mt-0 space-y-6">
      {/* Filter */}
      {!aclsLoading && acls.length > 0 && (
        <div className="flex items-center gap-3">
          <Typography variant="small" className="text-muted-foreground">
            Filter by:
          </Typography>
          <Select
            value={filterSubjectType}
            onValueChange={(value) =>
              onFilterChange(value as SubjectType | "all")
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subject Types</SelectItem>
              <SelectItem value="EMPLOYEE">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Employee</span>
                </div>
              </SelectItem>
              <SelectItem value="ROLE">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Role</span>
                </div>
              </SelectItem>
              <SelectItem value="DEPARTMENT">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Department</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Typography variant="small" className="text-muted-foreground">
            {filteredACLs.length} of {acls.length} ACLs
          </Typography>
        </div>
      )}

      {aclsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="mb-4 h-6 w-60" />
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className="h-20 w-full" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : filteredACLs.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-6 w-6" />}
          title="No ACLs found"
          description={
            search || filterSubjectType !== "all"
              ? "No ACLs match your filters"
              : "Create ACLs to grant specific access to resources"
          }
          action={
            !search &&
            filterSubjectType === "all" && (
              <Button onClick={onCreateACL}>Create ACL</Button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(aclsByResource).map(([key, group]) => {
            return (
              <Card key={key} className="overflow-hidden">
                {/* Resource Header */}
                <div className="bg-accent/30 border-b px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 ring-primary/20 rounded-lg p-2 ring-1">
                      <Shield className="text-primary h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant="p" className="font-bold">
                        {group.resourceType.replace(/_/g, " ")} #
                        {group.resourceId}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-muted-foreground"
                      >
                        {group.acls.length} ACL
                        {group.acls.length !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                    <Badge variant="secondary">{group.acls.length}</Badge>
                  </div>
                </div>

                {/* ACL List */}
                <div className="divide-y">
                  {group.acls.map((acl) => {
                    const AccessIcon = getAccessIcon(acl.access);
                    const SubjectIcon = getSubjectIcon(acl.subjectType);
                    const accessColor = getAccessColor(acl.access);
                    const subjectColor = getSubjectColor(acl.subjectType);

                    return (
                      <div
                        key={acl.id}
                        className="hover:bg-accent/30 flex items-start gap-4 p-6 transition-colors"
                      >
                        {/* Access Level Icon */}
                        <div
                          className={`mt-1 rounded-full p-2 ${
                            acl.access === "READ"
                              ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                              : acl.access === "WRITE"
                                ? "bg-orange-500/10 ring-1 ring-orange-500/20"
                                : "bg-red-500/10 ring-1 ring-red-500/20"
                          }`}
                        >
                          <AccessIcon className={`h-4 w-4 ${accessColor}`} />
                        </div>

                        {/* ACL Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <SubjectIcon
                              className={`h-4 w-4 ${subjectColor}`}
                            />
                            <Typography variant="p" className="font-semibold">
                              {acl.subjectType} #{acl.subjectId}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-muted-foreground"
                            >
                              →
                            </Typography>
                            <Badge
                              variant={
                                acl.access === "READ"
                                  ? "outline"
                                  : acl.access === "WRITE"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {acl.access}
                            </Badge>
                          </div>
                          {acl.reason && (
                            <Typography
                              variant="small"
                              className="text-muted-foreground mb-2"
                            >
                              {acl.reason}
                            </Typography>
                          )}
                          <Typography
                            variant="small"
                            className="text-muted-foreground"
                          >
                            Granted by: #{acl.grantedBy} •{" "}
                            {new Date(acl.createdAt).toLocaleDateString()}
                          </Typography>
                        </div>

                        {/* Actions */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteACL(acl.id)}
                          disabled={isDeleting}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
