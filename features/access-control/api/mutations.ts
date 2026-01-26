/**
 * React Query Mutations for Access Control
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  roleService,
  permissionService,
  employeeRoleService,
  employeePermissionService,
  dataScopeService,
  resourceACLService,
} from "./services";
import { accessControlKeys } from "./queries";
import type {
  RoleRequest,
  PermissionRequest,
  DataScopeRequest,
  ResourceACLRequest,
  AssignRoleRequest,
  EmployeePermissionRequest,
} from "../types";

// ============================================================================
// ROLE MUTATIONS
// ============================================================================

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleRequest) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.roles() });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: RoleRequest }) =>
      roleService.updateRole(roleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.roles() });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.role(variables.roleId),
      });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: number) => roleService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.roles() });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });
};

export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number;
      permissionId: number;
    }) => roleService.addPermissionToRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.roles() });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.role(variables.roleId),
      });
      toast.success("Permission added to role");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add permission to role"
      );
    },
  });
};

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number;
      permissionId: number;
    }) => roleService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.roles() });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.role(variables.roleId),
      });
      toast.success("Permission removed from role");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove permission from role"
      );
    },
  });
};

// ============================================================================
// PERMISSION MUTATIONS
// ============================================================================

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionRequest) =>
      permissionService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.permissions(),
      });
      toast.success("Permission created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create permission"
      );
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      permissionId,
      data,
    }: {
      permissionId: number;
      data: PermissionRequest;
    }) => permissionService.updatePermission(permissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.permissions(),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.permission(variables.permissionId),
      });
      toast.success("Permission updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update permission"
      );
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionId: number) =>
      permissionService.deletePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.permissions(),
      });
      toast.success("Permission deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete permission"
      );
    },
  });
};

// ============================================================================
// EMPLOYEE ROLE MUTATIONS
// ============================================================================

export const useAssignRolesToEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: number;
      data: AssignRoleRequest;
    }) => employeeRoleService.assignRolesToEmployee(employeeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employees(),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeePermissions(variables.employeeId),
      });
      toast.success("Roles assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign roles");
    },
  });
};

// ============================================================================
// EMPLOYEE CUSTOM PERMISSION MUTATIONS
// ============================================================================

export const useAssignPermissionToEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: number;
      data: EmployeePermissionRequest;
    }) =>
      employeePermissionService.assignPermissionToEmployee(employeeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeeCustomPermissions(
          variables.employeeId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeePermissions(variables.employeeId),
      });
      toast.success("Permission assigned to employee");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to assign permission"
      );
    },
  });
};

export const useRemovePermissionFromEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      permissionId,
    }: {
      employeeId: number;
      permissionId: number;
    }) =>
      employeePermissionService.removePermissionFromEmployee(
        employeeId,
        permissionId
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeeCustomPermissions(
          variables.employeeId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeePermissions(variables.employeeId),
      });
      toast.success("Permission removed from employee");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove permission"
      );
    },
  });
};

export const useRemoveAllCustomPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) =>
      employeePermissionService.removeAllCustomPermissions(employeeId),
    onSuccess: (_, employeeId) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeeCustomPermissions(employeeId),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.employeePermissions(employeeId),
      });
      toast.success("All custom permissions removed");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove permissions"
      );
    },
  });
};

// ============================================================================
// DATA SCOPE MUTATIONS
// ============================================================================

export const useCreateDataScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: number;
      data: DataScopeRequest;
    }) => dataScopeService.createDataScope(String(employeeId), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.dataScopes(),
      });
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.dataScopesByEmployee(variables.employeeId),
      });
      toast.success("Data scope created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create data scope"
      );
    },
  });
};

export const useUpdateDataScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scopeId,
      data,
    }: {
      scopeId: number | string;
      data: DataScopeRequest;
      employeeId?: number;
    }) => dataScopeService.updateDataScope(String(scopeId), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.dataScopes(),
      });
      toast.success("Data scope updated successfully");
      if (variables.employeeId) {
        queryClient.invalidateQueries({
          queryKey: accessControlKeys.dataScopesByEmployee(
            variables.employeeId
          ),
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update data scope"
      );
    },
  });
};

export const useDeleteDataScope = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scopeId }: { scopeId: number | string }) =>
      dataScopeService.deleteDataScope(String(scopeId)),
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: accessControlKeys.dataScopes(),
      });
      toast.success("Data scope deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete data scope"
      );
    },
  });
};

// ============================================================================
// RESOURCE ACL MUTATIONS
// ============================================================================

export const useCreateResourceACL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResourceACLRequest) =>
      resourceACLService.grantResourceAccess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.all });
      toast.success("Access control entry created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create ACL");
    },
  });
};

export const useDeleteResourceACL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (aclId: number) =>
      resourceACLService.revokeResourceAccess(aclId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.all });
      toast.success("Access control entry deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete ACL");
    },
  });
};
