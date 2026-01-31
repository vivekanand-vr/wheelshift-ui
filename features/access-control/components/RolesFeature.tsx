"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { EmptyState } from "@/components/common/EmptyState";
import { RolesGridView, RolesListView } from "./roles";
import { useRoleManagement } from "../hooks";
import { CreateRoleDialog, UpdateRoleDialog, DeleteRoleDialog } from "./roles";
import { PermissionManager } from "./permissions";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import { Plus, Grid3x3, List, Search, Shield } from "lucide-react";
import { RolesGridViewSkeleton, RolesListViewSkeleton } from "./shimmer";

type ViewMode = "grid" | "list";

export function RolesFeature() {
  const roleManagement = useRoleManagement();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [permissionManagerOpen, setPermissionManagerOpen] = useState(false);

  // Filter roles based on search
  const filteredRoles = roleManagement.roles.filter(
    (role) =>
      role.name.toLowerCase().includes(roleManagement.search.toLowerCase()) ||
      role.description
        ?.toLowerCase()
        .includes(roleManagement.search.toLowerCase())
  );

  return (
    <Container>
      <PageHeader
        title="Roles"
        description="Manage system roles and their permissions"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search roles..."
              value={roleManagement.search}
              onChange={(e) => roleManagement.setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
              <Button onClick={() => setCreateRoleDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </RoleGuard>
          </div>
        </div>

        {/* Roles View */}
        {roleManagement.rolesLoading ? (
          viewMode === "grid" ? (
            <RolesGridViewSkeleton />
          ) : (
            <RolesListViewSkeleton />
          )
        ) : filteredRoles.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-6 w-6" />}
            title="No roles found"
            description={
              roleManagement.search
                ? "No roles match your search criteria"
                : "Create your first role to get started"
            }
            action={
              !roleManagement.search && (
                <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                  <Button onClick={() => setCreateRoleDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </RoleGuard>
              )
            }
          />
        ) : viewMode === "grid" ? (
          <RolesGridView
            roles={filteredRoles}
            onEdit={(role) => {
              roleManagement.setSelectedRole(role);
              setUpdateRoleDialogOpen(true);
            }}
            onDelete={(role) => {
              roleManagement.setSelectedRole(role);
              setDeleteRoleDialogOpen(true);
            }}
            onManagePermissions={(role) => {
              roleManagement.setSelectedRole(role);
              setPermissionManagerOpen(true);
            }}
            isSuperAdmin={true}
          />
        ) : (
          <RolesListView
            roles={filteredRoles}
            onEdit={(role) => {
              roleManagement.setSelectedRole(role);
              setUpdateRoleDialogOpen(true);
            }}
            onDelete={(role) => {
              roleManagement.setSelectedRole(role);
              setDeleteRoleDialogOpen(true);
            }}
            onManagePermissions={(role) => {
              roleManagement.setSelectedRole(role);
              setPermissionManagerOpen(true);
            }}
            isSuperAdmin={true}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateRoleDialog
        open={createRoleDialogOpen}
        onClose={() => setCreateRoleDialogOpen(false)}
        onSubmit={(data) => {
          roleManagement.handleCreateRole(data, () =>
            setCreateRoleDialogOpen(false)
          );
        }}
        existingRoles={roleManagement.roles}
        isLoading={roleManagement.isCreating}
      />

      <UpdateRoleDialog
        open={updateRoleDialogOpen}
        onClose={() => {
          setUpdateRoleDialogOpen(false);
          roleManagement.setSelectedRole(null);
        }}
        onSubmit={(roleId, data) => {
          roleManagement.handleUpdateRole(roleId, data, () =>
            setUpdateRoleDialogOpen(false)
          );
        }}
        role={roleManagement.selectedRole}
        isLoading={roleManagement.isUpdating}
      />

      <DeleteRoleDialog
        open={deleteRoleDialogOpen}
        onClose={() => {
          setDeleteRoleDialogOpen(false);
          roleManagement.setSelectedRole(null);
        }}
        onConfirm={() => {
          if (roleManagement.selectedRole) {
            roleManagement.handleDeleteRole(
              roleManagement.selectedRole.id,
              () => setDeleteRoleDialogOpen(false)
            );
          }
        }}
        role={roleManagement.selectedRole}
        isLoading={roleManagement.isDeleting}
      />

      <PermissionManager
        open={permissionManagerOpen}
        onClose={() => {
          setPermissionManagerOpen(false);
          roleManagement.setSelectedRole(null);
        }}
        role={roleManagement.selectedRole}
        availablePermissions={roleManagement.permissions}
        onAddPermission={roleManagement.handleAddPermission}
        onRemovePermission={roleManagement.handleRemovePermission}
        isLoading={roleManagement.isManagingPermissions}
      />

      <ErrorDialog
        open={roleManagement.errorDialogOpen}
        onClose={() => roleManagement.setErrorDialogOpen(false)}
        type={roleManagement.apiError?.status === 500 ? "error" : "warning"}
        title={roleManagement.apiError?.title || "Error"}
        detail={roleManagement.apiError?.detail}
        code={roleManagement.apiError?.code}
        timestamp={roleManagement.apiError?.timestamp}
      />
    </Container>
  );
}
