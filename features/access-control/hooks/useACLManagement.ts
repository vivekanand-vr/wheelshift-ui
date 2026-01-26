"use client";

/**
 * ACL Management Hook
 * Handles resource access control list operations with React Query
 */

import { useState } from "react";
import { useCreateResourceACL, useDeleteResourceACL } from "../api/mutations";
import { useResourceACLs } from "../api/queries";
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
  const [selectedResource, setSelectedResource] =
    useState<ResourceIdentifier | null>(null);
  const [selectedACL, setSelectedACL] = useState<ResourceACL | null>(null);
  const [filterSubjectType, setFilterSubjectType] = useState<
    SubjectType | "all"
  >("all");
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const resourceType = selectedResource?.resourceType as ResourceType;
  const resourceId = selectedResource
    ? String(selectedResource.resourceId)
    : "";

  // Fetch ACLs for selected resource only (no "all ACLs" query)
  const {
    data: resourceACLs = [],
    isLoading: aclsLoading,
    error: aclsError,
  } = useResourceACLs(resourceType, resourceId);

  const createMutation = useCreateResourceACL();
  const deleteMutation = useDeleteResourceACL();

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
      onError: handleApiError,
    });
  };

  const handleDeleteACL = (aclId: number, onSuccess?: () => void) => {
    if (!selectedResource) return;

    deleteMutation.mutate(
      {
        aclId,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedACL(null);
        },
        onError: handleApiError,
      }
    );
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
