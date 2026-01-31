"use client";

import type { Employee } from "@/types";
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
import { EmployeeDataScopesSection } from ".";

interface EmployeeDataScopesDialogContentProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

function EmployeeDataScopesDialogContent({
  open,
  onClose,
  employee,
}: EmployeeDataScopesDialogContentProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden p-0">
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
            <Badge variant="secondary">Data Scopes</Badge>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-6 py-4">
          <EmployeeDataScopesSection employeeId={employee.id} />
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

export interface EmployeeDataScopesDialogProps extends Omit<
  EmployeeDataScopesDialogContentProps,
  "employee"
> {
  employee: Employee | null;
}

export function EmployeeDataScopesDialog(props: EmployeeDataScopesDialogProps) {
  if (!props.employee) return null;

  return (
    <EmployeeDataScopesDialogContent
      key={props.employee.id}
      {...props}
      employee={props.employee}
    />
  );
}
