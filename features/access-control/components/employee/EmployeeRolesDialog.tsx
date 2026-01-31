"use client";

import { useState } from "react";
import type { Employee } from "@/types";
import type { Role } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoleDisplay, getRoleIconBackground } from "../../utils";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeRolesSkeleton } from "../shimmer";

interface EmployeeRolesDialogContentProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  roles: Role[];
  employeeRoles: Role[];
  employeeRolesLoading: boolean;
  onAssignRole: (employeeId: number, roleId: number) => Promise<void>;
  onRemoveRole: (employeeId: number, roleId: number) => Promise<void>;
  isAssigning: boolean;
  isRemoving: boolean;
}

/**
 * Internal dialog content component that handles all role assignment logic.
 * Maintains local state for optimistic UI updates and handles role toggling.
 */
function EmployeeRolesDialogContent({
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
}: EmployeeRolesDialogContentProps) {
  const [localRoleIds, setLocalRoleIds] = useState<Set<number>>(
    () => new Set(employeeRoles.map((role) => role.id))
  );

  const handleToggleRole = async (roleId: number) => {
    const isCurrentlyAssigned = localRoleIds.has(roleId);

    setLocalRoleIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyAssigned) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });

    try {
      if (isCurrentlyAssigned) {
        await onRemoveRole(employee.id, roleId);
      } else {
        await onAssignRole(employee.id, roleId);
      }
    } catch (_error) {
      console.error(_error);
      // Revert on error to reflect actual server state
      setLocalRoleIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyAssigned) {
          next.add(roleId);
        } else {
          next.delete(roleId);
        }
        return next;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
                <UserCircle className="h-8 w-8" />
              </div>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {employee.name}
              </DialogTitle>
              <div className="mt-1 flex flex-wrap gap-2 text-sm">
                {employee.email && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {employee.email}
                  </div>
                )}
                {employee.phone && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {employee.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="border-b px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {employee.department && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {employee.department}
              </Badge>
            )}
            {employee.position && (
              <Badge variant="outline" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {employee.position}
              </Badge>
            )}
            <Badge variant="secondary">
              {localRoleIds.size} {localRoleIds.size === 1 ? "Role" : "Roles"}
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-6 py-4">
          <ScrollArea className="h-120 flex-1">
            <div className="space-y-2">
              {employeeRolesLoading ? (
                <EmployeeRolesSkeleton />
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
                      className={`hover:bg-accent mr-4 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                        isAssigned ? "bg-primary/5 border-primary/20" : ""
                      }`}
                      onClick={() => handleToggleRole(role.id)}
                    >
                      <Checkbox
                        checked={isAssigned}
                        onCheckedChange={() => handleToggleRole(role.id)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isAssigning || isRemoving}
                        className="mt-2"
                      />
                      <div
                        className={`rounded-lg p-2 ${getRoleIconBackground(roleDisplay.color)}`}
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
        <div className="bg-muted/50 flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Two-component pattern explanation:
 *
 * Purpose of wrapper component (EmployeeRolesDialog):
 * 1. Null safety check - Returns null if no employee is provided
 * 2. Force remounting - Uses a key prop to force React to completely unmount
 *    and remount the dialog when employee, open state, or roles change
 *
 * Why use the key pattern?
 *  - The rolesKey forces React to create a new component instance, which resets
 *    the localRoleIds state back to the initial value derived from employeeRoles.
 *  - This prevents stale state from persisting when switching between different
 *    employees without manually syncing state in useEffect.
 *
 * Note: This could be simplified into a single component using useEffect to
 * sync local state when props change, which would be more explicit.
 */
export interface EmployeeRolesDialogProps extends Omit<
  EmployeeRolesDialogContentProps,
  "employee"
> {
  employee: Employee | null;
}

export function EmployeeRolesDialog(props: EmployeeRolesDialogProps) {
  if (!props.employee) return null;

  // Generate unique key to force remount when employee or roles change
  const rolesKey = `${props.employee.id}-${props.open}-${props.employeeRoles
    .map((role) => role.id)
    .join("-")}`;

  return (
    <EmployeeRolesDialogContent
      key={rolesKey}
      {...props}
      employee={props.employee}
    />
  );
}
