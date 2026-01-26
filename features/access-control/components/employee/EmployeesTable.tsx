"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  MapPin,
  ShieldUser,
  RotateCcwKey,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeesTableSkeleton } from "../shimmer";
import type { Employee } from "@/types";

interface EmployeesTableProps {
  employees: Employee[];
  employeesLoading: boolean;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  search: string;
  onManageRoles: (employee: Employee) => void;
  onManageScopes: (employee: Employee) => void;
  onManagePermissions: (employee: Employee) => void;
  onPageChange: (page: number) => void;
}

export function EmployeesTable({
  employees,
  employeesLoading,
  totalPages,
  totalElements,
  currentPage,
  pageSize,
  search,
  onManageRoles,
  onManageScopes,
  onManagePermissions,
  onPageChange,
}: EmployeesTableProps) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalElements);

  return (
    <div className="space-y-6">
      {employeesLoading ? (
        <EmployeesTableSkeleton />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No employees found"
          description={
            search
              ? "No employees match your search criteria"
              : "No employees available"
          }
        />
      ) : (
        <>
          {/* Employee Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Employee
                    </th>
                    <th className="hidden px-6 py-3 text-left text-xs font-medium tracking-wider uppercase md:table-cell">
                      Position
                    </th>
                    <th className="hidden px-6 py-3 text-left text-xs font-medium tracking-wider uppercase lg:table-cell">
                      Department
                    </th>
                    <th className="hidden px-6 py-3 text-left text-xs font-medium tracking-wider uppercase xl:table-cell">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-accent transition-colors"
                    >
                      {/* Employee Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            {employee.avatar ? (
                              <Image
                                src={employee.avatar}
                                alt={employee.name}
                                width={40}
                                height={40}
                                sizes="40px"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-sm font-semibold">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                            )}
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-semibold">
                              {employee.name}
                            </div>
                            <div className="text-muted-foreground truncate text-sm">
                              {employee.email}
                            </div>
                            {/* Mobile-only badges */}
                            <div className="mt-1 flex flex-wrap gap-1 md:hidden">
                              {employee.position && (
                                <Badge variant="outline" className="text-xs">
                                  {employee.position}
                                </Badge>
                              )}
                              {employee.department && (
                                <Badge variant="secondary" className="text-xs">
                                  {employee.department}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="hidden px-6 py-4 md:table-cell">
                        {employee.position ? (
                          <Badge variant="outline">{employee.position}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="hidden px-6 py-4 lg:table-cell">
                        {employee.department ? (
                          <Badge variant="secondary">
                            {employee.department}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="hidden px-6 py-4 xl:table-cell">
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status || "active"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <ShieldUser className="mr-2 h-3.5 w-3.5" />
                              <span className="hidden sm:inline">
                                Manage Access
                              </span>
                              <span className="sm:hidden">Access</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="dark:bg-neutral-950"
                          >
                            <DropdownMenuItem
                              onClick={() => onManageRoles(employee)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Edit Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onManagePermissions(employee)}
                            >
                              <RotateCcwKey className="mr-2 h-4 w-4" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onManageScopes(employee)}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Data Scopes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 0 && (
            <Card className="p-4">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Typography variant="small" className="text-muted-foreground">
                  Showing {startIndex} to {endIndex} of {totalElements}{" "}
                  employees
                </Typography>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "secondary" : "ghost"
                          }
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
