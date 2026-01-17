"use client";

/**
 * Employee Role Management Hook
 * Handles all employee role assignment logic
 */

import { useState } from "react";
import { useEmployees, useAssignRolesToEmployee } from "../api";
import type { Employee } from "@/types";

export function useEmployeeRoles() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  // Queries
  const { data: paginatedData, isLoading } = useEmployees();
  const employees = paginatedData?.content || [];

  // Mutations
  const assignRolesMutation = useAssignRolesToEmployee();

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleToggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleAssignRoles = (onSuccess?: () => void) => {
    if (selectedEmployee) {
      assignRolesMutation.mutate(
        { employeeId: selectedEmployee.id, data: { roleIds: selectedRoleIds } },
        {
          onSuccess: () => {
            onSuccess?.();
            setSelectedEmployee(null);
            setSelectedRoleIds([]);
            setSearch("");
          },
        }
      );
    }
  };

  const reset = () => {
    setSearch("");
    setSelectedEmployee(null);
    setSelectedRoleIds([]);
  };

  return {
    // State
    search,
    selectedEmployee,
    selectedRoleIds,
    filteredEmployees,

    // Loading states
    isLoading,
    isAssigning: assignRolesMutation.isPending,

    // Actions
    setSearch,
    handleSelectEmployee,
    handleToggleRole,
    handleAssignRoles,
    reset,
  };
}
