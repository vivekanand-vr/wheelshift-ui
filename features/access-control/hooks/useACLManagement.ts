"use client";

/**
 * ACL Management Hook
 * Handles resource access control list operations with React Query
 */

import { useState, useEffect } from "react";
import {
  useCreateResourceACL,
  useDeleteResourceACL,
  useRevokeAllResourceACLs,
} from "../api/mutations";
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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Resource selection state
  const [resourceType, setResourceType] = useState<ResourceType>("CAR");
  const [resourceId, setResourceId] = useState("");
  const [inputWarning, setInputWarning] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const selectedResourceType = selectedResource?.resourceType as ResourceType;
  const selectedResourceId = selectedResource?.resourceId;

  // Fetch ACLs for selected resource only (no "all ACLs" query)
  const {
    data: resourceACLs = [],
    isLoading: aclsLoading,
    error: aclsError,
  } = useResourceACLs(selectedResourceType, selectedResourceId ?? 0);

  const createMutation = useCreateResourceACL();
  const deleteMutation = useDeleteResourceACL();
  const revokeAllMutation = useRevokeAllResourceACLs();

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
    resourceId: number,
    data: ResourceACLRequest,
    onSuccess?: () => void
  ) => {
    createMutation.mutate(
      { resourceType, resourceId, data },
      {
        onSuccess: () => {
          onSuccess?.();
          setSelectedACL(null);
          setCreateDialogOpen(false);
        },
        onError: handleApiError,
      }
    );
  };

  const handleDeleteACL = (aclId: number, onSuccess?: () => void) => {
    if (!selectedResource) return;

    deleteMutation.mutate(
      {
        aclId,
        resourceType: selectedResource.resourceType,
        resourceId: selectedResource.resourceId,
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

  const handleRevokeAllACLs = (onSuccess?: () => void) => {
    if (!selectedResource) return;

    revokeAllMutation.mutate(
      {
        resourceType: selectedResource.resourceType,
        resourceId: selectedResource.resourceId,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setRevokeAllDialogOpen(false);
        },
        onError: handleApiError,
      }
    );
  };

  const handleSelectResource = (resource: ResourceIdentifier | null) => {
    setSelectedResource(resource);
  };

  const handleLoadResource = () => {
    const parsedId = parseInt(resourceId);
    if (!resourceType || !resourceId) return;

    if (isNaN(parsedId)) {
      setInputWarning(
        "Resource ID must be numeric (e.g., 123). Non-numeric values are rejected by the API."
      );
      return;
    }

    handleSelectResource({ resourceType, resourceId: parsedId });
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleOpenDeleteDialog = (acl: ResourceACL) => {
    setSelectedACL(acl);
    setDeleteDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedACL(null);
  };

  const handleOpenRevokeAllDialog = () => {
    setRevokeAllDialogOpen(true);
  };

  const handleCloseRevokeAllDialog = () => {
    setRevokeAllDialogOpen(false);
  };

  // Filter resource ACLs by subject type and search query
  const filteredACLs = resourceACLs.filter((acl) => {
    const matchesSearch =
      acl.resourceType
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      acl.subjectType
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      String(acl.subjectId).includes(debouncedSearchQuery);

    const matchesFilter =
      filterSubjectType === "all" || acl.subjectType === filterSubjectType;

    return matchesSearch && matchesFilter;
  });

  return {
    // Data
    resourceACLs,
    filteredACLs,
    selectedResource,
    selectedACL,
    filterSubjectType,
    apiError,
    errorDialogOpen,
    searchQuery,
    debouncedSearchQuery,
    resourceType,
    resourceId,
    inputWarning,
    createDialogOpen,
    deleteDialogOpen,
    revokeAllDialogOpen,

    // Loading states
    aclsLoading,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRevokingAll: revokeAllMutation.isPending,

    // Errors
    aclsError,

    // Actions
    setSelectedACL,
    setErrorDialogOpen,
    setSearchQuery,
    setResourceType,
    setResourceId,
    setInputWarning,
    setCreateDialogOpen,
    setDeleteDialogOpen,
    setRevokeAllDialogOpen,
    handleCreateACL,
    handleDeleteACL,
    handleRevokeAllACLs,
    handleSelectResource,
    handleLoadResource,
    handleOpenCreateDialog,
    handleOpenDeleteDialog,
    handleCloseCreateDialog,
    handleCloseDeleteDialog,
    handleOpenRevokeAllDialog,
    handleCloseRevokeAllDialog,
    setFilterSubjectType,
  };
}
