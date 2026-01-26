"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmployeesTable } from "./employee/EmployeesTable";
import { useEmployeeManagement, useRoleManagement } from "../hooks";
import {
  EmployeeRolesDialog,
  EmployeeDataScopesDialog,
  EmployeePermissionsDialog,
} from "./employee";
import { Search } from "lucide-react";
import type { Employee } from "@/types";

export function EmployeesFeature() {
  const employeeManagement = useEmployeeManagement();
  const roleManagement = useRoleManagement();
  const [employeeRolesDialogOpen, setEmployeeRolesDialogOpen] = useState(false);
  const [employeeScopesDialogOpen, setEmployeeScopesDialogOpen] =
    useState(false);
  const [employeePermissionsDialogOpen, setEmployeePermissionsDialogOpen] =
    useState(false);

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
        title="Employees"
        description="Manage employee roles, permissions, and data access"
      />

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search employees..."
            value={employeeManagement.search}
            onChange={(e) => employeeManagement.setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <EmployeesTable
          employees={employeeManagement.employees}
          employeesLoading={employeeManagement.employeesLoading}
          totalPages={employeeManagement.totalPages}
          totalElements={employeeManagement.totalElements}
          currentPage={employeeManagement.currentPage}
          pageSize={employeeManagement.pageSize}
          search={employeeManagement.search}
          onManageRoles={handleManageRoles}
          onManageScopes={handleManageScopes}
          onManagePermissions={handleManagePermissions}
          onPageChange={employeeManagement.setCurrentPage}
        />
      </div>

      {/* Dialogs */}
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
    </Container>
  );
}
