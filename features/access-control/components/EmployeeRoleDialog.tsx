"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Avatar } from "@/components/ui/avatar";
import type { Employee } from "@/types";
import { getRoleDisplay } from "../utils";
import type { Role } from "../types";

interface EmployeeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  roles: Role[];
  employeeRoles: Role[];
  employeeRolesLoading: boolean;
  onAssignRole: (employeeId: number, roleId: number) => Promise<void>;
  onRemoveRole: (employeeId: number, roleId: number) => Promise<void>;
  isAssigning: boolean;
  isRemoving: boolean;
}

type EmployeeRoleDialogContentProps = Omit<
  EmployeeRoleDialogProps,
  "employee"
> & {
  employee: Employee;
};

function EmployeeRoleDialogContent({
  open,
  onClose,
  employee,
  roles,
  employeeRoles,
  employeeRolesLoading,
  onAssignRole,
  onRemoveRole,
  isAssigning,
  isRemoving,
}: EmployeeRoleDialogContentProps) {
  const buildRoleIdSet = () => new Set(employeeRoles.map((r) => r.id));
  const [localRoleIds, setLocalRoleIds] = useState<Set<number>>(buildRoleIdSet);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setLocalRoleIds(buildRoleIdSet());
      onClose();
      return;
    }

    setLocalRoleIds(buildRoleIdSet());
  };

  const handleToggleRole = async (roleId: number) => {
    if (!employee) return;

    const isCurrentlyAssigned = localRoleIds.has(roleId);

    if (isCurrentlyAssigned) {
      // Optimistic update
      setLocalRoleIds((prev) => {
        const next = new Set(prev);
        next.delete(roleId);
        return next;
      });
      try {
        await onRemoveRole(employee.id, roleId);
      } catch (error) {
        // Revert on error
        console.error("Failed to remove role:", error);
        setLocalRoleIds((prev) => new Set(prev).add(roleId));
      }
    } else {
      // Optimistic update
      setLocalRoleIds((prev) => new Set(prev).add(roleId));
      try {
        await onAssignRole(employee.id, roleId);
      } catch (error) {
        // Revert on error
        console.error("Failed to assign role:", error);
        setLocalRoleIds((prev) => {
          const next = new Set(prev);
          next.delete(roleId);
          return next;
        });
      }
    }
  };

  if (!employee) return null;

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Employee Roles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="bg-accent/50 flex items-center gap-3 rounded-lg border p-4">
            <Avatar className="h-12 w-12">
              {employee.avatar ? (
                <Image
                  src={employee.avatar}
                  alt={employee.name}
                  width={48}
                  height={48}
                  sizes="48px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-sm font-semibold">
                  {getInitials(employee.name)}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <Typography variant="small" className="mb-1 font-semibold">
                {employee.name}
              </Typography>
              <Typography
                variant="small"
                className="text-muted-foreground text-xs"
              >
                {employee.email}
              </Typography>
              {employee.position && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {employee.position}
                </Badge>
              )}
            </div>
            <Badge variant="secondary">
              {localRoleIds.size} {localRoleIds.size === 1 ? "Role" : "Roles"}
            </Badge>
          </div>

          {/* Roles List */}
          <div>
            <Typography variant="small" className="mb-3 text-sm font-semibold">
              Available Roles ({roles.length})
            </Typography>
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {employeeRolesLoading ? (
                  <div className="text-muted-foreground py-12 text-center">
                    Loading employee roles...
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
                        onClick={() => handleToggleRole(role.id)}
                      >
                        <Checkbox
                          checked={isAssigned}
                          onCheckedChange={() => handleToggleRole(role.id)}
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
                          <RoleIcon
                            className={`h-4 w-4 ${roleDisplay.color}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
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
        </div>

        <div className="bg-muted/50 flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EmployeeRoleDialog(props: EmployeeRoleDialogProps) {
  if (!props.employee) return null;

  return (
    <EmployeeRoleDialogContent
      key={props.employee.id}
      {...props}
      employee={props.employee}
    />
  );
}
