"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import type { Employee } from "@/types";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  Plus,
  Search,
  Shield,
  Users,
  Grid3x3,
  List,
  KeyRound,
} from "lucide-react";
import { RolesGridView } from "./RolesGridView";
import { RolesListView } from "./RolesListView";
import { RoleDialog } from "./RoleDialog";
import { PermissionManager } from "./PermissionManager";
import { PermissionDialog } from "./PermissionDialog";
import { EmployeeRoleDialog } from "./EmployeeRoleDialog";
import { PermissionsTab } from "./PermissionsTab";
import { EmployeesTab } from "./EmployeesTab";
import { RolesGridViewSkeleton, RolesListViewSkeleton } from "./shimmer";
import {
  useRoleManagement,
  usePermissionManagement,
  useEmployeeManagement,
} from "../hooks";

type ViewMode = "grid" | "list";

export function TabsHeader() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <TabsList className="bg-muted grid w-full max-w-md grid-cols-3 p-1">
        <TabsTrigger
          value="roles"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground gap-2 data-[state=active]:shadow-md"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Roles</span>
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground gap-2 data-[state=active]:shadow-md"
        >
          <KeyRound className="h-4 w-4" />
          <span className="hidden sm:inline">Permissions</span>
        </TabsTrigger>
        <TabsTrigger
          value="employees"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground gap-2 data-[state=active]:shadow-md"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Employees</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}

export function AccessControlFeature() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Local UI state
  const [activeTab, setActiveTab] = useState("roles");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [permissionManagerOpen, setPermissionManagerOpen] = useState(false);
  const [employeeRoleDialogOpen, setEmployeeRoleDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Hooks with all business logic
  const roleManagement = useRoleManagement();
  const permissionManagement = usePermissionManagement();
  const employeeManagement = useEmployeeManagement();

  // Sync search state with current tab
  const search =
    activeTab === "roles"
      ? roleManagement.search
      : activeTab === "permissions"
        ? permissionManagement.search
        : activeTab === "employees"
          ? employeeManagement.search
          : "";

  const setSearch = (value: string) => {
    if (activeTab === "roles") {
      roleManagement.setSearch(value);
    } else if (activeTab === "permissions") {
      permissionManagement.setSearch(value);
    } else if (activeTab === "employees") {
      employeeManagement.setSearch(value);
    }
  };

  // Handle employee click
  const handleEmployeeClick = (employee: Employee) => {
    employeeManagement.setSelectedEmployee(employee);
    setEmployeeRoleDialogOpen(true);
  };

  return (
    <Container>
      <PageHeader
        title="Access Control"
        description="Manage roles, permissions, and user access across the system"
      />

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tabs Header */}
          <TabsHeader />

          {/* Action Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex max-w-2xl flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle - Only for roles tab */}
              {activeTab === "roles" && (
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
              )}

              {/* Action Buttons */}
              {activeTab === "roles" && isSuperAdmin && (
                <Button onClick={() => setRoleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">New Role</span>
                </Button>
              )}
              {activeTab === "permissions" && isSuperAdmin && (
                <Button onClick={() => setPermissionDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">New Permission</span>
                </Button>
              )}
            </div>
          </div>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-0 space-y-6">
            {roleManagement.rolesLoading ? (
              viewMode === "grid" ? (
                <RolesGridViewSkeleton count={6} />
              ) : (
                <RolesListViewSkeleton count={6} />
              )
            ) : roleManagement.filteredRoles.length === 0 ? (
              <EmptyState
                icon={<Shield className="h-6 w-6" />}
                title="No roles found"
                description={
                  search
                    ? "No roles match your search criteria"
                    : "Create your first role to get started"
                }
              />
            ) : viewMode === "grid" ? (
              <RolesGridView
                roles={roleManagement.filteredRoles}
                onEdit={(role) => {
                  roleManagement.openEditDialog(role);
                  setRoleDialogOpen(true);
                }}
                onDelete={(role) => {
                  roleManagement.openDeleteDialog(role);
                  setDeleteConfirmOpen(true);
                }}
                onManagePermissions={(role) => {
                  roleManagement.setSelectedRole(role);
                  setPermissionManagerOpen(true);
                }}
                isSuperAdmin={isSuperAdmin}
              />
            ) : (
              <RolesListView
                roles={roleManagement.filteredRoles}
                onEdit={(role) => {
                  roleManagement.openEditDialog(role);
                  setRoleDialogOpen(true);
                }}
                onDelete={(role) => {
                  roleManagement.openDeleteDialog(role);
                  setDeleteConfirmOpen(true);
                }}
                onManagePermissions={(role) => {
                  roleManagement.setSelectedRole(role);
                  setPermissionManagerOpen(true);
                }}
                isSuperAdmin={isSuperAdmin}
              />
            )}
          </TabsContent>

          {/* Permissions Tab */}
          <PermissionsTab
            permissionsLoading={permissionManagement.permissionsLoading}
            groupedPermissions={permissionManagement.groupedPermissions}
            search={search}
          />

          {/* Employees Tab */}
          <EmployeesTab
            employees={employeeManagement.employees}
            employeesLoading={employeeManagement.employeesLoading}
            totalPages={employeeManagement.totalPages}
            totalElements={employeeManagement.totalElements}
            currentPage={employeeManagement.currentPage}
            pageSize={employeeManagement.pageSize}
            search={search}
            onEmployeeClick={handleEmployeeClick}
            onPageChange={employeeManagement.setCurrentPage}
          />
        </Tabs>
      </div>

      {/* Dialogs */}
      <RoleDialog
        open={roleDialogOpen}
        onClose={() => {
          setRoleDialogOpen(false);
          roleManagement.setSelectedRole(null);
        }}
        onSubmit={(data) => {
          if (roleManagement.selectedRole) {
            roleManagement.handleUpdateRole(
              roleManagement.selectedRole.id,
              data,
              () => setRoleDialogOpen(false)
            );
          } else {
            roleManagement.handleCreateRole(data, () =>
              setRoleDialogOpen(false)
            );
          }
        }}
        role={roleManagement.selectedRole}
        isLoading={roleManagement.isCreating || roleManagement.isUpdating}
        isSuperAdmin={isSuperAdmin}
      />

      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        onSubmit={(data) => {
          permissionManagement.handleCreatePermission(data, () =>
            setPermissionDialogOpen(false)
          );
        }}
        isLoading={permissionManagement.isCreating}
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

      <EmployeeRoleDialog
        open={employeeRoleDialogOpen}
        onClose={() => {
          setEmployeeRoleDialogOpen(false);
          employeeManagement.setSelectedEmployee(null);
        }}
        employee={employeeManagement.selectedEmployee}
        roles={roleManagement.roles}
        employeeRoles={employeeManagement.employeeRoles}
        employeeRolesLoading={employeeManagement.employeeRolesLoading}
        onAssignRole={employeeManagement.handleAssignRole}
        onRemoveRole={employeeManagement.handleRemoveRole}
        isAssigning={employeeManagement.isAssigningRole}
        isRemoving={employeeManagement.isRemovingRole}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          roleManagement.setRoleToDelete(null);
        }}
        onConfirm={() => {
          roleManagement.handleDeleteRole(() => setDeleteConfirmOpen(false));
        }}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${roleManagement.roleToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={roleManagement.isDeleting}
      />
    </Container>
  );
}
