"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User } from "lucide-react";
import { useEmployeeRoles } from "../hooks";
import type { Role } from "../types";

interface EmployeeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  roles: Role[];
}

export function EmployeeRoleDialog({
  open,
  onClose,
  roles,
}: EmployeeRoleDialogProps) {
  const {
    search,
    selectedEmployee,
    selectedRoleIds,
    filteredEmployees,
    isLoading,
    isAssigning,
    setSearch,
    handleSelectEmployee,
    handleToggleRole,
    handleAssignRoles,
    reset,
  } = useEmployeeRoles();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    handleAssignRoles(() => {
      handleClose();
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] sm:max-w-225">
        <DialogHeader>
          <DialogTitle>Assign Roles to Employees</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Employee List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-100 rounded-lg border">
              <div className="space-y-1 p-2">
                {isLoading ? (
                  <div className="text-muted-foreground p-4 text-center">
                    Loading employees...
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="text-muted-foreground p-4 text-center">
                    No employees found
                  </div>
                ) : (
                  filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => handleSelectEmployee(employee)}
                      className={`hover:bg-accent flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                        selectedEmployee?.id === employee.id ? "bg-accent" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <Typography variant="small" className="font-medium">
                          {employee.name}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-muted-foreground text-xs"
                        >
                          {employee.email}
                        </Typography>
                        {employee.roles && employee.roles.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {employee.roles.map((role) => (
                              <Badge
                                key={role.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Role Assignment */}
          <div className="space-y-4">
            {selectedEmployee ? (
              <>
                <div className="bg-accent/50 rounded-lg border p-4">
                  <Typography variant="small" className="mb-1 font-semibold">
                    Selected Employee
                  </Typography>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(selectedEmployee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Typography variant="small" className="font-medium">
                        {selectedEmployee.name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-muted-foreground text-xs"
                      >
                        {selectedEmployee.email}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div>
                  <Typography variant="small" className="mb-3 font-semibold">
                    Assign Roles
                  </Typography>
                  <ScrollArea className="h-75 rounded-lg border p-4">
                    <div className="space-y-3">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="hover:bg-accent flex cursor-pointer items-start gap-3 rounded-lg p-2"
                          onClick={() => handleToggleRole(role.id)}
                        >
                          <Checkbox
                            checked={selectedRoleIds.includes(role.id)}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={isAssigning}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Typography
                                variant="small"
                                className="font-medium"
                              >
                                {role.name}
                              </Typography>
                              {role.isSystem && (
                                <Badge variant="secondary" className="text-xs">
                                  System
                                </Badge>
                              )}
                            </div>
                            {role.description && (
                              <Typography
                                variant="small"
                                className="text-muted-foreground mt-1 text-xs"
                              >
                                {role.description}
                              </Typography>
                            )}
                            <Typography
                              variant="small"
                              className="text-muted-foreground mt-1 text-xs"
                            >
                              {role.permissions?.length || 0} permissions
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isAssigning}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isAssigning}>
                    {isAssigning ? "Assigning..." : "Assign Roles"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="bg-accent mb-4 rounded-full p-4">
                  <User className="text-muted-foreground h-8 w-8" />
                </div>
                <Typography variant="small" className="mb-2 font-medium">
                  No Employee Selected
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Select an employee from the list to assign roles
                </Typography>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
