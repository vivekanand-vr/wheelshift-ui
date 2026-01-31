"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import {
  Shield,
  Plus,
  Search,
  Lock,
  ShieldAlert,
  Car,
  Users,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Receipt,
  Settings,
  Briefcase,
  ClipboardCheck,
  MapPin,
  ListTodo,
  CalendarDays,
  UserCog,
  Key,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { CreateACLDialog } from "./CreateACLDialog";
import { DeleteACLDialog } from "./DeleteACLDialog";
import { RevokeAllACLDialog } from "./RevokeAllACLDialog";
import { ACLEntry } from "./ACLEntry";
import { ACLEntrySkeleton } from "../shimmer";
import { useACLManagement } from "../../hooks/useACLManagement";
import type {
  SubjectType,
  ResourceType,
  ResourceACLRequest,
} from "../../types";

const RESOURCE_TYPES: ResourceType[] = [
  "CAR",
  "CLIENT",
  "INQUIRY",
  "RESERVATION",
  "SALE",
  "TRANSACTION",
];

function getResourceIcon(type: ResourceType) {
  const iconMap: Record<ResourceType, React.ElementType> = {
    CAR: Car,
    CLIENT: Users,
    INQUIRY: MessageSquare,
    RESERVATION: Calendar,
    SALE: ShoppingCart,
    TRANSACTION: Receipt,
    CAR_MODEL: Settings,
    EMPLOYEE: Briefcase,
    INSPECTION: ClipboardCheck,
    LOCATION: MapPin,
    TASK: ListTodo,
    EVENT: CalendarDays,
    ROLE: UserCog,
    PERMISSION: Key,
    ACL: ShieldCheck,
    NOTIFICATION: Bell,
  };
  return iconMap[type] || Shield;
}

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
    isRevokingAll,
    searchQuery,
    resourceType,
    resourceId,
    inputWarning,
    createDialogOpen,
    deleteDialogOpen,
    revokeAllDialogOpen,
    setErrorDialogOpen,
    setSearchQuery,
    setResourceType,
    setResourceId,
    setInputWarning,
    handleCreateACL,
    handleDeleteACL,
    handleRevokeAllACLs,
    handleLoadResource,
    handleOpenCreateDialog,
    handleOpenDeleteDialog,
    handleCloseCreateDialog,
    handleCloseDeleteDialog,
    handleOpenRevokeAllDialog,
    handleCloseRevokeAllDialog,
    setFilterSubjectType,
  } = useACLManagement();

  const handleCreateSubmit = (
    resType: ResourceType,
    resId: number,
    data: ResourceACLRequest
  ) => {
    handleCreateACL(resType, resId, data, () => {});
  };

  const handleDeleteConfirm = (aclId: number) => {
    handleDeleteACL(aclId, () => {
      handleCloseDeleteDialog();
    });
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
                <SelectTrigger id="resourceType" className="w-full">
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

            <div className="flex items-center gap-2">
              <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                <Button onClick={handleOpenCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Grant Access
                </Button>
              </RoleGuard>
              {filteredACLs.length > 0 && (
                <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                  <Button
                    variant="destructive"
                    onClick={handleOpenRevokeAllDialog}
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Revoke All
                  </Button>
                </RoleGuard>
              )}
            </div>
          </div>

          {/* ACL List */}
          {aclsLoading ? (
            <ACLEntrySkeleton />
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
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="resource-acls"
            >
              <AccordionItem
                value="resource-acls"
                className="rounded-lg border"
              >
                <AccordionTrigger className="hover:bg-accent/30 px-6 py-4 hover:no-underline">
                  <div className="flex w-full items-center gap-3">
                    <div className="bg-primary/10 ring-primary/20 rounded-lg p-2 ring-1">
                      {(() => {
                        const ResourceIcon = getResourceIcon(
                          selectedResource.resourceType
                        );
                        return (
                          <ResourceIcon className="text-primary h-5 w-5" />
                        );
                      })()}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <Typography variant="p" className="font-bold">
                          {selectedResource.resourceType.replace(/_/g, " ")}
                        </Typography>
                        <Badge variant="outline" className="font-mono text-xs">
                          {selectedResource.resourceId}
                        </Badge>
                      </div>
                      <Typography
                        variant="small"
                        className="text-muted-foreground mt-0.5"
                      >
                        {filteredACLs.length} ACL
                        {filteredACLs.length !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {filteredACLs.length}
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pt-2 pb-6">
                  {/* ACL List - Grid Layout */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredACLs.map((acl) => (
                      <ACLEntry
                        key={acl.id}
                        acl={acl}
                        onDelete={handleOpenDeleteDialog}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

      <RevokeAllACLDialog
        open={revokeAllDialogOpen}
        onClose={handleCloseRevokeAllDialog}
        onConfirm={() => handleRevokeAllACLs(() => {})}
        resourceType={selectedResource?.resourceType || null}
        resourceId={selectedResource?.resourceId || null}
        aclCount={filteredACLs.length}
        isLoading={isRevokingAll}
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
