"use client";

/**
 * ACL Management Hook
 * Handles resource access control list operations with React Query
 */

import { useState, useEffect } from "react";
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
  const selectedResourceId = selectedResource
    ? String(selectedResource.resourceId)
    : "";

  // Fetch ACLs for selected resource only (no "all ACLs" query)
  const {
    data: resourceACLs = [],
    isLoading: aclsLoading,
    error: aclsError,
  } = useResourceACLs(selectedResourceType, selectedResourceId);

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

    deleteMutation.mutate(aclId, {
      onSuccess: () => {
        onSuccess?.();
        setSelectedACL(null);
      },
      onError: handleApiError,
    });
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

    // Loading states
    aclsLoading,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,

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
    handleCreateACL,
    handleDeleteACL,
    handleSelectResource,
    handleLoadResource,
    handleOpenCreateDialog,
    handleOpenDeleteDialog,
    handleCloseCreateDialog,
    handleCloseDeleteDialog,
    setFilterSubjectType,
  };
}
