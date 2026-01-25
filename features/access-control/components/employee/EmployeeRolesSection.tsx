"use client";

import type { Role } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getRoleDisplay } from "../../utils/mappings";

interface EmployeeRolesSectionProps {
  roles: Role[];
  employeeRolesLoading: boolean;
  localRoleIds: Set<number>;
  onToggleRole: (roleId: number) => void;
  isAssigning: boolean;
  isRemoving: boolean;
}

export function EmployeeRolesSection({
  roles,
  employeeRolesLoading,
  localRoleIds,
  onToggleRole,
  isAssigning,
  isRemoving,
}: EmployeeRolesSectionProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {employeeRolesLoading ? (
            <div className="text-muted-foreground py-12 text-center">
              Loading employee roles...
            </div>
          ) : roles.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              No roles available
            </div>
          ) : (
            roles.map((role) => {
              const roleDisplay = getRoleDisplay(role.name);
              const RoleIcon = roleDisplay.icon;
              const isAssigned = localRoleIds.has(role.id);

              return (
                <div
                  key={role.id}
                  className={`hover:bg-accent flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                    isAssigned ? "bg-primary/5 border-primary/20" : ""
                  }`}
                  onClick={() => onToggleRole(role.id)}
                >
                  <Checkbox
                    checked={isAssigned}
                    onCheckedChange={() => onToggleRole(role.id)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isAssigning || isRemoving}
                    className="mt-0.5"
                  />
                  <div
                    className={`rounded-lg p-2 ${
                      roleDisplay.color.includes("purple")
                        ? "bg-purple-500/10 ring-1 ring-purple-500/20"
                        : roleDisplay.color.includes("blue")
                          ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                          : roleDisplay.color.includes("green")
                            ? "bg-green-500/10 ring-1 ring-green-500/20"
                            : roleDisplay.color.includes("orange")
                              ? "bg-orange-500/10 ring-1 ring-orange-500/20"
                              : "bg-gray-500/10 ring-1 ring-gray-500/20"
                    }`}
                  >
                    <RoleIcon className={`h-4 w-4 ${roleDisplay.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Typography variant="small" className="font-semibold">
                        {roleDisplay.label}
                      </Typography>
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">
                          System
                        </Badge>
                      )}
                    </div>
                    {role.description && (
                      <Typography
                        variant="small"
                        className="text-muted-foreground line-clamp-2 text-xs leading-relaxed"
                      >
                        {role.description}
                      </Typography>
                    )}
                    <Badge
                      variant="secondary"
                      className="mt-2 font-mono text-xs"
                    >
                      {role.permissions?.length || 0} permissions
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
