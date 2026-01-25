"use client";

/**
 * ACL Management Hook
 * Handles resource access control list operations with React Query
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceACLService } from "../api/services";
import type {
  ResourceACL,
  ResourceACLRequest,
  ResourceType,
  SubjectType,
} from "../types";

interface ResourceIdentifier {
  resourceType: ResourceType;
  resourceId: number;
}

export function useACLManagement() {
  const queryClient = useQueryClient();
  const [selectedResource, setSelectedResource] =
    useState<ResourceIdentifier | null>(null);
  const [filterSubjectType, setFilterSubjectType] = useState<
    SubjectType | "all"
  >("all");

  // Fetch all ACLs
  const {
    data: allACLs = [],
    isLoading: aclsLoading,
    error: aclsError,
  } = useQuery({
    queryKey: ["acls"],
    queryFn: resourceACLService.getAllACLs,
  });

  // Fetch ACLs for selected resource
  const { data: resourceACLs = [], isLoading: resourceACLsLoading } = useQuery({
    queryKey: [
      "acls",
      "resource",
      selectedResource?.resourceType,
      selectedResource?.resourceId,
    ],
    queryFn: () =>
      selectedResource
        ? resourceACLService.getResourceACLs(
            selectedResource.resourceType,
            selectedResource.resourceId
          )
        : Promise.resolve([]),
    enabled: !!selectedResource,
  });

  // Create ACL mutation
  const createMutation = useMutation({
    mutationFn: ({
      resourceType,
      resourceId,
      data,
    }: {
      resourceType: ResourceType;
      resourceId: number;
      data: Omit<ResourceACLRequest, "resourceType" | "resourceId">;
    }) => resourceACLService.createResourceACL(resourceType, resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acls"] });
      toast.success("ACL entry created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create ACL entry"
      );
    },
  });

  // Delete ACL mutation
  const deleteMutation = useMutation({
    mutationFn: (aclId: number) => resourceACLService.deleteResourceACL(aclId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acls"] });
      toast.success("ACL entry deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete ACL entry"
      );
    },
  });

  // Delete all ACLs for a resource
  const deleteAllMutation = useMutation({
    mutationFn: ({
      resourceType,
      resourceId,
    }: {
      resourceType: ResourceType;
      resourceId: number;
    }) => resourceACLService.removeAllACLsForResource(resourceType, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acls"] });
      toast.success("All ACL entries removed for resource");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove ACL entries"
      );
    },
  });

  // Handler functions
  const handleCreateACL = async (
    resourceType: ResourceType,
    resourceId: number,
    data: Omit<ResourceACLRequest, "resourceType" | "resourceId">
  ) => {
    await createMutation.mutateAsync({ resourceType, resourceId, data });
  };

  const handleDeleteACL = async (aclId: number) => {
    await deleteMutation.mutateAsync(aclId);
  };

  const handleDeleteAllACLs = async (
    resourceType: ResourceType,
    resourceId: number
  ) => {
    await deleteAllMutation.mutateAsync({ resourceType, resourceId });
  };

  const handleSelectResource = (resource: ResourceIdentifier | null) => {
    setSelectedResource(resource);
  };

  // Filter ACLs by subject type
  const filteredACLs =
    filterSubjectType === "all"
      ? allACLs
      : allACLs.filter((acl) => acl.subjectType === filterSubjectType);

  // Group ACLs by resource type for better organization
  const aclsByResourceType: Record<string, ResourceACL[]> = {};
  allACLs.forEach((acl) => {
    const type = acl.resourceType;
    if (!aclsByResourceType[type]) {
      aclsByResourceType[type] = [];
    }
    aclsByResourceType[type].push(acl);
  });

  // Group ACLs by subject type
  const aclsBySubjectType: Record<SubjectType, ResourceACL[]> = {
    EMPLOYEE: allACLs.filter((acl) => acl.subjectType === "EMPLOYEE"),
    ROLE: allACLs.filter((acl) => acl.subjectType === "ROLE"),
    DEPARTMENT: allACLs.filter((acl) => acl.subjectType === "DEPARTMENT"),
  };

  return {
    // Data
    allACLs,
    filteredACLs,
    resourceACLs,
    aclsByResourceType,
    aclsBySubjectType,
    selectedResource,
    filterSubjectType,

    // Loading states
    aclsLoading,
    resourceACLsLoading,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeletingAll: deleteAllMutation.isPending,

    // Errors
    aclsError,

    // Handlers
    handleCreateACL,
    handleDeleteACL,
    handleDeleteAllACLs,
    handleSelectResource,
    setFilterSubjectType,
  };
}
