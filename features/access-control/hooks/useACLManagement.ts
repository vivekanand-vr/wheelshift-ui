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
  ApiErrorResponse,
} from "../types";

interface ResourceIdentifier {
  resourceType: ResourceType;
  resourceId: number;
}

export function useACLManagement() {
  const queryClient = useQueryClient();
  const [selectedResource, setSelectedResource] =
    useState<ResourceIdentifier | null>(null);
  const [selectedACL, setSelectedACL] = useState<ResourceACL | null>(null);
  const [filterSubjectType, setFilterSubjectType] = useState<
    SubjectType | "all"
  >("all");
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Fetch ACLs for selected resource only (no "all ACLs" query)
  const {
    data: resourceACLs = [],
    isLoading: aclsLoading,
    error: aclsError,
  } = useQuery({
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
            String(selectedResource.resourceId)
          )
        : Promise.resolve([]),
    enabled: !!selectedResource,
  });

  // Error handler
  const handleApiError = (error: any) => {
    if (error?.response?.data) {
      const errorData = error.response.data;
      setApiError({
        type: errorData.type || "about:blank",
        title: errorData.title || "An Error Occurred",
        status: errorData.status || 500,
        detail: errorData.detail || "An unexpected error occurred",
        instance: errorData.instance || "",
        code: errorData.code || "UNKNOWN_ERROR",
        timestamp: errorData.timestamp || new Date().toISOString(),
      });
      setErrorDialogOpen(true);
    }
  };

  // Create ACL mutation
  const createMutation = useMutation({
    mutationFn: (data: ResourceACLRequest) =>
      resourceACLService.grantResourceAccess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acls"] });
      toast.success("ACL entry created successfully");
    },
    onError: handleApiError,
  });

  // Delete ACL mutation
  const deleteMutation = useMutation({
    mutationFn: (aclId: number) =>
      resourceACLService.revokeResourceAccess(aclId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acls"] });
      toast.success("ACL entry deleted successfully");
    },
    onError: handleApiError,
  });

  // Handler functions
  const handleCreateACL = (
    resourceType: ResourceType,
    resourceId: string,
    data: Omit<ResourceACLRequest, "resourceType" | "resourceId">,
    onSuccess?: () => void
  ) => {
    const fullData: ResourceACLRequest = {
      resourceType,
      resourceId,
      ...data,
    };
    createMutation.mutate(fullData, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedACL(null);
      },
    });
  };

  const handleDeleteACL = (aclId: number, onSuccess?: () => void) => {
    deleteMutation.mutate(aclId, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedACL(null);
      },
    });
  };

  const handleSelectResource = (resource: ResourceIdentifier | null) => {
    setSelectedResource(resource);
  };

  // Filter resource ACLs by subject type (only works when a resource is selected)
  const filteredACLs =
    filterSubjectType === "all"
      ? resourceACLs
      : resourceACLs.filter((acl) => acl.subjectType === filterSubjectType);

  return {
    // Data
    resourceACLs,
    filteredACLs,
    selectedResource,
    selectedACL,
    filterSubjectType,
    apiError,
    errorDialogOpen,

    // Loading states
    aclsLoading,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Errors
    aclsError,

    // Actions
    setSelectedACL,
    setErrorDialogOpen,
    handleCreateACL,
    handleDeleteACL,
    handleSelectResource,
    setFilterSubjectType,
  };
}
