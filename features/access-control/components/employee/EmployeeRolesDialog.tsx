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
import { EmployeeRolesSection } from ".";

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

        <div className="max-h-120 overflow-auto px-6 py-4">
          <EmployeeRolesSection
            roles={roles}
            employeeRolesLoading={employeeRolesLoading}
            localRoleIds={localRoleIds}
            onToggleRole={handleToggleRole}
            isAssigning={isAssigning}
            isRemoving={isRemoving}
          />
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

export interface EmployeeRolesDialogProps extends Omit<
  EmployeeRolesDialogContentProps,
  "employee"
> {
  employee: Employee | null;
}

export function EmployeeRolesDialog(props: EmployeeRolesDialogProps) {
  if (!props.employee) return null;

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
