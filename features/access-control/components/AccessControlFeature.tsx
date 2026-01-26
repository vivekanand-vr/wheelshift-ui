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
import { ErrorDialog } from "@/components/common/ErrorDialog";
import {
  Plus,
  Search,
  Shield,
  Users,
  Grid3x3,
  List,
  KeyRound,
  Lock,
} from "lucide-react";
import { RolesGridView } from "./roles/RolesGridView";
import { RolesListView } from "./roles/RolesListView";
import { CreateRoleDialog } from "./roles/CreateRoleDialog";
import { UpdateRoleDialog } from "./roles/UpdateRoleDialog";
import { DeleteRoleDialog } from "./roles/DeleteRoleDialog";
import {
  CreatePermissionDialog,
  UpdatePermissionDialog,
  DeletePermissionDialog,
} from "./permissions";
import { PermissionManager } from "./permissions/PermissionManager";
import { EmployeeDataScopesDialog } from "./employee/EmployeeDataScopesDialog";
import { EmployeeRolesDialog } from "./employee/EmployeeRolesDialog";
import { EmployeePermissionsDialog } from "./employee/EmployeePermissionsDialog";
import { PermissionsTab } from "./PermissionsTab";
import { EmployeesTab } from "./EmployeesTab";
import { ACLsTab } from "./ACLsTab";
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
      <TabsList className="bg-muted grid w-full max-w-2xl grid-cols-4 p-1">
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
        <TabsTrigger
          value="acls"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground gap-2 data-[state=active]:shadow-md"
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">ACLs</span>
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
  const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [createPermissionDialogOpen, setCreatePermissionDialogOpen] =
    useState(false);
  const [updatePermissionDialogOpen, setUpdatePermissionDialogOpen] =
    useState(false);
  const [deletePermissionDialogOpen, setDeletePermissionDialogOpen] =
    useState(false);
  const [permissionManagerOpen, setPermissionManagerOpen] = useState(false);
  const [employeeRolesDialogOpen, setEmployeeRolesDialogOpen] = useState(false);
  const [employeeScopesDialogOpen, setEmployeeScopesDialogOpen] =
    useState(false);
  const [employeePermissionsDialogOpen, setEmployeePermissionsDialogOpen] =
    useState(false);

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

  // Handle employee actions
  const handleManageRoles = (employee: Employee) => {
    employeeManagement.setSelectedEmployee(employee);
    setEmployeeRolesDialogOpen(true);
  };

  const handleManageScopes = (employee: Employee) => {
    employeeManagement.setSelectedEmployee(employee);
    setEmployeeScopesDialogOpen(true);
  };

  const handleManagePermissions = (employee: Employee) => {
    employeeManagement.setSelectedEmployee(employee);
    setEmployeePermissionsDialogOpen(true);
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
                <Button onClick={() => setCreateRoleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">New Role</span>
                </Button>
              )}
              {activeTab === "permissions" && isSuperAdmin && (
                <Button onClick={() => setCreatePermissionDialogOpen(true)}>
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
                isSuperAdmin={isSuperAdmin}
              />
            ) : (
              <RolesListView
                roles={roleManagement.filteredRoles}
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
                isSuperAdmin={isSuperAdmin}
              />
            )}
          </TabsContent>

          {/* Permissions Tab */}
          <PermissionsTab
            permissionsLoading={permissionManagement.permissionsLoading}
            groupedPermissions={permissionManagement.groupedPermissions}
            search={search}
            onEdit={(permission) => {
              permissionManagement.setSelectedPermission(permission);
              setUpdatePermissionDialogOpen(true);
            }}
            onDelete={(permission) => {
              permissionManagement.setSelectedPermission(permission);
              setDeletePermissionDialogOpen(true);
            }}
            isSuperAdmin={isSuperAdmin}
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
            onManageRoles={handleManageRoles}
            onManagePermissions={handleManagePermissions}
            onManageScopes={handleManageScopes}
            onPageChange={employeeManagement.setCurrentPage}
          />

          {/* ACLs Tab */}
          <ACLsTab />
        </Tabs>
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

      <EmployeeRolesDialog
        open={employeeRolesDialogOpen}
        onClose={() => {
          setEmployeeRolesDialogOpen(false);
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

      <EmployeeDataScopesDialog
        open={employeeScopesDialogOpen}
        onClose={() => {
          setEmployeeScopesDialogOpen(false);
          employeeManagement.setSelectedEmployee(null);
        }}
        employee={employeeManagement.selectedEmployee}
      />

      {employeeManagement.selectedEmployee && (
        <EmployeePermissionsDialog
          open={employeePermissionsDialogOpen}
          onClose={() => {
            setEmployeePermissionsDialogOpen(false);
            employeeManagement.setSelectedEmployee(null);
          }}
          employee={employeeManagement.selectedEmployee}
        />
      )}

      {/* Error Dialogs */}
      <ErrorDialog
        open={roleManagement.errorDialogOpen}
        onClose={() => roleManagement.setErrorDialogOpen(false)}
        type={roleManagement.apiError?.status === 500 ? "error" : "warning"}
        title={roleManagement.apiError?.title || "Error"}
        detail={roleManagement.apiError?.detail}
        code={roleManagement.apiError?.code}
        timestamp={roleManagement.apiError?.timestamp}
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
