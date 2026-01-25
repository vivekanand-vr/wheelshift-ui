"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, UserCheck, Check, X, Trash2 } from "lucide-react";
import type { EmployeeDataScope, ScopeType } from "../types";

interface DataScopesTabProps {
  dataScopes: EmployeeDataScope[];
  scopesLoading: boolean;
  search: string;
  onCreateScope: () => void;
  onDeleteScope: (scopeId: number) => void;
  isDeleting?: boolean;
}

export function DataScopesTab({
  dataScopes,
  scopesLoading,
  search,
  onCreateScope,
  onDeleteScope,
  isDeleting,
}: DataScopesTabProps) {
  // Filter scopes based on search
  const filteredScopes = dataScopes.filter(
    (scope) =>
      scope.scopeValue.toLowerCase().includes(search.toLowerCase()) ||
      scope.description?.toLowerCase().includes(search.toLowerCase()) ||
      scope.scopeType.toLowerCase().includes(search.toLowerCase())
  );

  // Group scopes by type
  const scopesByType = filteredScopes.reduce(
    (acc, scope) => {
      if (!acc[scope.scopeType]) {
        acc[scope.scopeType] = [];
      }
      acc[scope.scopeType].push(scope);
      return acc;
    },
    {} as Record<ScopeType, EmployeeDataScope[]>
  );

  const getScopeTypeIcon = (type: ScopeType) => {
    switch (type) {
      case "LOCATION":
        return MapPin;
      case "DEPARTMENT":
        return Building2;
      case "ASSIGNMENT":
        return UserCheck;
      default:
        return MapPin;
    }
  };

  const getScopeTypeColor = (type: ScopeType) => {
    switch (type) {
      case "LOCATION":
        return "text-blue-600";
      case "DEPARTMENT":
        return "text-purple-600";
      case "ASSIGNMENT":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <TabsContent value="data-scopes" className="mt-0 space-y-6">
      {scopesLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredScopes.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="No data scopes found"
          description={
            search
              ? "No data scopes match your search criteria"
              : "Create data scopes to restrict employee access to specific resources"
          }
          action={
            !search && (
              <Button onClick={onCreateScope}>Create Data Scope</Button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(scopesByType).map(([type, scopes]) => {
            const TypeIcon = getScopeTypeIcon(type as ScopeType);
            const typeColor = getScopeTypeColor(type as ScopeType);

            return (
              <Card key={type} className="overflow-hidden">
                {/* Section Header */}
                <div className="bg-accent/30 border-b px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        type === "LOCATION"
                          ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                          : type === "DEPARTMENT"
                            ? "bg-purple-500/10 ring-1 ring-purple-500/20"
                            : "bg-green-500/10 ring-1 ring-green-500/20"
                      }`}
                    >
                      <TypeIcon className={`h-5 w-5 ${typeColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant="p" className="font-bold">
                        {type} Scopes
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-muted-foreground"
                      >
                        {scopes.length} scope{scopes.length !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                    <Badge variant="secondary">{scopes.length}</Badge>
                  </div>
                </div>

                {/* Scope List */}
                <div className="divide-y">
                  {scopes.map((scope) => (
                    <div
                      key={scope.id}
                      className="hover:bg-accent/30 flex items-start gap-4 p-6 transition-colors"
                    >
                      {/* Effect Icon */}
                      <div
                        className={`mt-1 rounded-full p-2 ${
                          scope.effect === "INCLUDE"
                            ? "bg-green-500/10 ring-1 ring-green-500/20"
                            : "bg-red-500/10 ring-1 ring-red-500/20"
                        }`}
                      >
                        {scope.effect === "INCLUDE" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>

                      {/* Scope Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              scope.effect === "INCLUDE"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {scope.effect}
                          </Badge>
                          <Typography
                            variant="p"
                            className="font-mono font-semibold"
                          >
                            {scope.scopeValue}
                          </Typography>
                        </div>
                        {scope.description && (
                          <Typography
                            variant="small"
                            className="text-muted-foreground"
                          >
                            {scope.description}
                          </Typography>
                        )}
                        <Typography
                          variant="small"
                          className="text-muted-foreground mt-2"
                        >
                          Employee ID: {scope.employeeId} •{" "}
                          {new Date(scope.createdAt).toLocaleDateString()}
                        </Typography>
                      </div>

                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteScope(scope.id)}
                        disabled={isDeleting}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
