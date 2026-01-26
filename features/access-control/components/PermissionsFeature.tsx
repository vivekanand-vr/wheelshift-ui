"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PermissionsList } from "./permissions/PermissionsList";
import { usePermissionManagement } from "../hooks";
import {
  CreatePermissionDialog,
  UpdatePermissionDialog,
  DeletePermissionDialog,
} from "./permissions";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import { Plus, Search } from "lucide-react";

export function PermissionsFeature() {
  const permissionManagement = usePermissionManagement();
  const [createPermissionDialogOpen, setCreatePermissionDialogOpen] =
    useState(false);
  const [updatePermissionDialogOpen, setUpdatePermissionDialogOpen] =
    useState(false);
  const [deletePermissionDialogOpen, setDeletePermissionDialogOpen] =
    useState(false);

  return (
    <Container>
      <PageHeader
        title="Permissions"
        description="Manage granular system permissions"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search permissions..."
              value={permissionManagement.search}
              onChange={(e) => permissionManagement.setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
            <Button onClick={() => setCreatePermissionDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Permission
            </Button>
          </RoleGuard>
        </div>

        {/* Permissions View */}
        <PermissionsList
          permissionsLoading={permissionManagement.permissionsLoading}
          groupedPermissions={permissionManagement.groupedPermissions}
          search={permissionManagement.search}
          onEdit={(permission) => {
            permissionManagement.setSelectedPermission(permission);
            setUpdatePermissionDialogOpen(true);
          }}
          onDelete={(permission) => {
            permissionManagement.setSelectedPermission(permission);
            setDeletePermissionDialogOpen(true);
          }}
          isSuperAdmin={true}
        />
      </div>

      {/* Dialogs */}
      <CreatePermissionDialog
        open={createPermissionDialogOpen}
        onClose={() => setCreatePermissionDialogOpen(false)}
        onSubmit={(data) => {
          permissionManagement.handleCreatePermission(data, () =>
            setCreatePermissionDialogOpen(false)
          );
        }}
        isLoading={permissionManagement.isCreating}
        permissions={permissionManagement.permissions}
      />

      <UpdatePermissionDialog
        open={updatePermissionDialogOpen}
        onClose={() => {
          setUpdatePermissionDialogOpen(false);
          permissionManagement.setSelectedPermission(null);
        }}
        onSubmit={(permissionId, data) => {
          permissionManagement.handleUpdatePermission(permissionId, data, () =>
            setUpdatePermissionDialogOpen(false)
          );
        }}
        permission={permissionManagement.selectedPermission}
        isLoading={permissionManagement.isUpdating}
      />

      <DeletePermissionDialog
        open={deletePermissionDialogOpen}
        onClose={() => {
          setDeletePermissionDialogOpen(false);
          permissionManagement.setSelectedPermission(null);
        }}
        onConfirm={() => {
          if (permissionManagement.selectedPermission) {
            permissionManagement.handleDeletePermission(
              permissionManagement.selectedPermission.id,
              () => setDeletePermissionDialogOpen(false)
            );
          }
        }}
        permission={permissionManagement.selectedPermission}
        isLoading={permissionManagement.isDeleting}
      />

      <ErrorDialog
        open={permissionManagement.errorDialogOpen}
        onClose={() => permissionManagement.setErrorDialogOpen(false)}
        type={
          permissionManagement.apiError?.status === 409
            ? "info"
            : permissionManagement.apiError?.status === 500
              ? "error"
              : "warning"
        }
        title={permissionManagement.apiError?.title || "Error"}
        detail={permissionManagement.apiError?.detail}
        code={permissionManagement.apiError?.code}
        timestamp={permissionManagement.apiError?.timestamp}
      />
    </Container>
  );
}
