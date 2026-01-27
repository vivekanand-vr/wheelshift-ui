"use client";

import { useState } from "react";
import type { CreateDataScopeInput, EmployeeDataScope } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ErrorDialog } from "@/components/common/ErrorDialog";
import { Plus, MapPin, MoreVertical, Edit, Trash2 } from "lucide-react";
import { CreateDataScopeDialog } from "../data-scopes/CreateDataScopeDialog";
import { UpdateDataScopeDialog } from "../data-scopes/UpdateDataScopeDialog";
import { DeleteDataScopeDialog } from "../data-scopes/DeleteDataScopeDialog";
import { useEmployeeDataScopes } from "../../hooks";
import Loader from "@/components/common/Loader";

interface EmployeeDataScopesSectionProps {
  employeeId: number;
}

export function EmployeeDataScopesSection({
  employeeId,
}: EmployeeDataScopesSectionProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    scopes,
    scopesLoading,
    isCreating,
    isUpdating,
    isDeleting,
    selectedScope,
    setSelectedScope,
    handleCreateScope,
    handleUpdateScope,
    handleDeleteScope,
    apiError,
    errorDialogOpen,
    setErrorDialogOpen,
  } = useEmployeeDataScopes(employeeId);

  // Group scopes by type
  const groupedScopes = scopes.reduce<Record<string, EmployeeDataScope[]>>(
    (acc, scope) => {
      if (!acc[scope.scopeType]) {
        acc[scope.scopeType] = [];
      }
      acc[scope.scopeType].push(scope);
      return acc;
    },
    {}
  );

  const getScopeTypeBadge = (scopeType: string) => {
    switch (scopeType) {
      case "DEPARTMENT":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-600"
          >
            Department
          </Badge>
        );
      case "LOCATION":
        return (
          <Badge
            variant="outline"
            className="border-green-500/20 bg-green-500/10 text-green-600"
          >
            Location
          </Badge>
        );
      case "PROJECT":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/20 bg-purple-500/10 text-purple-600"
          >
            Project
          </Badge>
        );
      case "CUSTOM":
        return (
          <Badge
            variant="outline"
            className="border-orange-500/20 bg-orange-500/10 text-orange-600"
          >
            Custom
          </Badge>
        );
      default:
        return <Badge variant="outline">{scopeType}</Badge>;
    }
  };

  const getEffectBadge = (effect: string) => {
    return effect === "ALLOW" ? (
      <Badge
        variant="outline"
        className="border-green-500/20 bg-green-500/10 text-green-600"
      >
        Allow
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-red-500/20 bg-red-500/10 text-red-600"
      >
        Deny
      </Badge>
    );
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="small" className="text-sm font-semibold">
            Data Scopes ({scopes.length})
          </Typography>
          <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              disabled={scopesLoading}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Scope
            </Button>
          </RoleGuard>
        </div>

        {/* Content */}
        <ScrollArea className="h-100 flex-1">
          {scopesLoading ? (
            <Loader />
          ) : scopes.length === 0 ? (
            <EmptyState
              icon={<MapPin className="h-5 w-5" />}
              title="No data scopes"
              description="This employee has no data scopes assigned"
            />
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedScopes).map(([scopeType, scopeList]) => (
                <div key={scopeType} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getScopeTypeBadge(scopeType)}
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-xs"
                    >
                      {scopeList.length}{" "}
                      {scopeList.length === 1 ? "scope" : "scopes"}
                    </Typography>
                  </div>

                  <div className="space-y-2">
                    {scopeList.map((scope) => (
                      <div
                        key={scope.id}
                        className="hover:bg-accent flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Typography variant="small" className="font-medium">
                              {scope.scopeValue}
                            </Typography>
                            {getEffectBadge(scope.effect)}
                          </div>
                          {scope.description && (
                            <Typography
                              variant="small"
                              className="text-muted-foreground line-clamp-2 text-xs"
                            >
                              {scope.description}
                            </Typography>
                          )}
                        </div>

                        <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={isDeleting}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedScope(scope);
                                  setUpdateDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedScope(scope);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </RoleGuard>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Dialogs */}
      <CreateDataScopeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={(data: CreateDataScopeInput) =>
          handleCreateScope(data, () => setCreateDialogOpen(false))
        }
        employeeId={employeeId}
        isLoading={isCreating}
      />

      <UpdateDataScopeDialog
        open={updateDialogOpen}
        onClose={() => {
          setUpdateDialogOpen(false);
          setSelectedScope(null);
        }}
        onSubmit={(scopeId, data) =>
          handleUpdateScope(scopeId, data, () => setUpdateDialogOpen(false))
        }
        scope={selectedScope}
        isLoading={isUpdating}
      />

      <DeleteDataScopeDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedScope(null);
        }}
        onConfirm={(scopeId) =>
          handleDeleteScope(scopeId, () => setDeleteDialogOpen(false))
        }
        scope={selectedScope}
        isLoading={isDeleting}
      />

      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        type={apiError?.status === 500 ? "error" : "warning"}
        title={apiError?.title || "Error"}
        detail={apiError?.detail}
        code={apiError?.code}
        timestamp={apiError?.timestamp}
      />
    </>
  );
}
