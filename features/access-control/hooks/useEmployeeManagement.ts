"use client";

/**
 * Employee Management Hook
 * Handles employee fetching, pagination, and role management
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Employee } from "@/types";
import { employeeRoleService } from "../api/services";
import type { Role } from "../types";

interface UseEmployeeManagementReturn {
  // Employee list state
  employees: Employee[];
  employeesLoading: boolean;
  employeesError: Error | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  search: string;

  // Actions
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Selected employee state
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;

  // Employee roles
  employeeRoles: Role[];
  employeeRolesLoading: boolean;
  fetchEmployeeRoles: (employeeId: number) => void;

  // Role assignment
  isAssigningRole: boolean;
  isRemovingRole: boolean;
  handleAssignRole: (employeeId: number, roleId: number) => Promise<void>;
  handleRemoveRole: (employeeId: number, roleId: number) => Promise<void>;
}

export function useEmployeeManagement(): UseEmployeeManagementReturn {
  const queryClient = useQueryClient();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset to first page when search changes
      if (search !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch employees with pagination and search
  const {
    data: paginatedData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ["employees", currentPage, pageSize, debouncedSearch],
    queryFn: () =>
      employeeRoleService.getAllEmployees({
        page: currentPage,
        pageSize,
        search: debouncedSearch || undefined,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch employee roles when selected
  const {
    data: employeeRoles = [],
    isLoading: employeeRolesLoading,
    refetch: fetchEmployeeRoles,
  } = useQuery({
    queryKey: ["employeeRoles", selectedEmployee?.id],
    queryFn: () =>
      selectedEmployee
        ? employeeRoleService.getEmployeeRoles(selectedEmployee.id)
        : Promise.resolve([]),
    enabled: !!selectedEmployee,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({
      employeeId,
      roleId,
    }: {
      employeeId: number;
      roleId: number;
    }) => employeeRoleService.assignRoleToEmployee(employeeId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employeeRoles", selectedEmployee?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Role assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign role");
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: ({
      employeeId,
      roleId,
    }: {
      employeeId: number;
      roleId: number;
    }) => employeeRoleService.removeRoleFromEmployee(employeeId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employeeRoles", selectedEmployee?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Role removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove role");
    },
  });

  // Handle role assignment
  const handleAssignRole = async (employeeId: number, roleId: number) => {
    await assignRoleMutation.mutateAsync({ employeeId, roleId });
  };

  // Handle role removal
  const handleRemoveRole = async (employeeId: number, roleId: number) => {
    await removeRoleMutation.mutateAsync({ employeeId, roleId });
  };

  return {
    // Employee list state
    employees: paginatedData?.content || [],
    employeesLoading,
    employeesError: employeesError as Error | null,
    totalPages: paginatedData?.totalPages || 0,
    totalElements: paginatedData?.totalElements || 0,
    currentPage,
    pageSize,
    search,

    // Actions
    setSearch,
    setCurrentPage,
    setPageSize,

    // Selected employee state
    selectedEmployee,
    setSelectedEmployee,

    // Employee roles
    employeeRoles,
    employeeRolesLoading,
    fetchEmployeeRoles: () => fetchEmployeeRoles(),

    // Role assignment
    isAssigningRole: assignRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
    handleAssignRole,
    handleRemoveRole,
  };
}
