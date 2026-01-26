"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import { Shield, Trash2, Plus, Search, Lock } from "lucide-react";
import { CreateACLDialog } from "./CreateACLDialog";
import { DeleteACLDialog } from "./DeleteACLDialog";
import { useACLManagement } from "../../hooks/useACLManagement";
import type { SubjectType, ResourceType } from "../../types";
import {
  getAccessIcon,
  getAccessColor,
  getSubjectIcon,
  getSubjectColor,
} from "../../utils";

const RESOURCE_TYPES: ResourceType[] = [
  "CAR",
  "CLIENT",
  "INQUIRY",
  "RESERVATION",
  "SALE",
  "TRANSACTION",
];

export function ACLs() {
  const {
    filteredACLs,
    aclsLoading,
    selectedResource,
    selectedACL,
    filterSubjectType,
    apiError,
    errorDialogOpen,
    isCreating,
    isDeleting,
    searchQuery,
    resourceType,
    resourceId,
    inputWarning,
    createDialogOpen,
    deleteDialogOpen,
    setErrorDialogOpen,
    setSearchQuery,
    setResourceType,
    setResourceId,
    setInputWarning,
    handleCreateACL,
    handleDeleteACL,
    handleLoadResource,
    handleOpenCreateDialog,
    handleOpenDeleteDialog,
    handleCloseCreateDialog,
    handleCloseDeleteDialog,
    setFilterSubjectType,
  } = useACLManagement();

  const handleCreateSubmit = (
    resType: ResourceType,
    resId: number,
    data: any
  ) => {
    handleCreateACL(resType, String(resId), data, () => {});
  };

  const handleDeleteConfirm = (aclId: number) => {
    handleDeleteACL(aclId, () => {});
  };

  return (
    <div className="space-y-6">
      {/* Resource Selector */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="text-primary h-5 w-5" />
              <Typography variant="h4">Select Resource</Typography>
            </div>
            <Typography variant="small" className="text-muted-foreground">
              Choose a resource to view and manage its access control entries
            </Typography>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={(value) =>
                  setResourceType(value as ResourceType)
                }
              >
                <SelectTrigger id="resourceType">
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
              <Label htmlFor="resourceId">Resource ID</Label>
              <Input
                id="resourceId"
                type="text"
                placeholder="e.g., CAR-123 or 123"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLoadResource();
                  }
                }}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleLoadResource}
                disabled={!resourceType || !resourceId}
              >
                <Search className="mr-2 h-4 w-4" />
                Load ACLs
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ACL Management Section */}
      {selectedResource && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative max-w-sm flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search ACLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filterSubjectType}
                onValueChange={(value) =>
                  setFilterSubjectType(value as SubjectType | "all")
                }
              >
                <SelectTrigger className="w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="EMPLOYEE">Employees</SelectItem>
                  <SelectItem value="ROLE">Roles</SelectItem>
                  <SelectItem value="DEPARTMENT">Departments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Grant Access
              </Button>
            </RoleGuard>
          </div>

          {/* ACL List */}
          {aclsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-9 w-9" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredACLs.length === 0 ? (
            <EmptyState
              icon={<Shield />}
              title="No ACL Entries"
              description={
                searchQuery || filterSubjectType !== "all"
                  ? "No ACL entries match your filters."
                  : `No access control entries found for ${selectedResource.resourceType} #${selectedResource.resourceId}.`
              }
              action={
                !searchQuery &&
                filterSubjectType === "all" && (
                  <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                    <Button onClick={handleOpenCreateDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Grant Access
                    </Button>
                  </RoleGuard>
                )
              }
            />
          ) : (
            <Card className="overflow-hidden">
              {/* Resource Header */}
              <div className="bg-accent/30 border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 ring-primary/20 rounded-lg p-2 ring-1">
                    <Shield className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography variant="p" className="font-bold">
                      {selectedResource.resourceType.replace(/_/g, " ")} #
                      {selectedResource.resourceId}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      {filteredACLs.length} ACL
                      {filteredACLs.length !== 1 ? "s" : ""}
                    </Typography>
                  </div>
                  <Badge variant="secondary">{filteredACLs.length}</Badge>
                </div>
              </div>

              {/* ACL List */}
              <div className="divide-y">
                {filteredACLs.map((acl) => {
                  const AccessIcon = getAccessIcon(acl.accessLevel);
                  const SubjectIcon = getSubjectIcon(acl.subjectType);
                  const accessColor = getAccessColor(acl.accessLevel);
                  const subjectColor = getSubjectColor(acl.subjectType);

                  return (
                    <div
                      key={acl.id}
                      className="hover:bg-accent/30 group flex items-start gap-4 p-6 transition-colors"
                    >
                      {/* Access Level Icon */}
                      <div
                        className={`mt-1 rounded-full p-2 ${
                          acl.accessLevel === "READ"
                            ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                            : acl.accessLevel === "WRITE"
                              ? "bg-orange-500/10 ring-1 ring-orange-500/20"
                              : "bg-red-500/10 ring-1 ring-red-500/20"
                        }`}
                      >
                        <AccessIcon className={`h-4 w-4 ${accessColor}`} />
                      </div>

                      {/* ACL Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <SubjectIcon className={`h-4 w-4 ${subjectColor}`} />
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
                              acl.accessLevel === "READ"
                                ? "outline"
                                : acl.accessLevel === "WRITE"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {acl.accessLevel}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(acl)}
                          disabled={isDeleting}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateACLDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      <DeleteACLDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        acl={selectedACL}
        isLoading={isDeleting}
      />

      {inputWarning && (
        <ErrorDialog
          open={!!inputWarning}
          onClose={() => setInputWarning(null)}
          type="warning"
          title="Resource ID must be numeric"
          detail={inputWarning}
        />
      )}

      {apiError && (
        <ErrorDialog
          open={errorDialogOpen}
          onClose={() => setErrorDialogOpen(false)}
          title={apiError.title}
          detail={apiError.detail}
          code={apiError.code}
          timestamp={apiError.timestamp}
        />
      )}
    </div>
  );
}
