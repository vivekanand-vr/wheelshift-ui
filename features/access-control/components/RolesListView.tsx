"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { MoreVertical, Edit, Trash2, Wrench } from "lucide-react";
import type { Role } from "../types";
import { getRoleDisplay } from "../utils";

interface RolesListViewProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
  isSuperAdmin?: boolean;
}

export function RolesListView({
  roles,
  onEdit,
  onDelete,
  onManagePermissions,
  isSuperAdmin,
}: RolesListViewProps) {
  return (
    <div className="space-y-3">
      {roles.map((role) => {
        const canEdit = isSuperAdmin || !role.isSystem;
        const canDelete = isSuperAdmin && !role.isSystem;
        const roleDisplay = getRoleDisplay(role.name);
        const RoleIcon = roleDisplay.icon;

        return (
          <Card
            key={role.id}
            className="group hover:border-primary/50 relative overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Background Gradient */}
            <div className="from-primary/5 absolute inset-0 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="relative flex items-center gap-4 p-4">
              {/* Icon */}
              <div
                className={`shrink-0 rounded-xl p-3 ${roleDisplay.color.includes("purple") ? "bg-purple-500/10 ring-1 ring-purple-500/20" : roleDisplay.color.includes("blue") ? "bg-blue-500/10 ring-1 ring-blue-500/20" : roleDisplay.color.includes("green") ? "bg-green-500/10 ring-1 ring-green-500/20" : roleDisplay.color.includes("orange") ? "bg-orange-500/10 ring-1 ring-orange-500/20" : roleDisplay.color.includes("teal") ? "bg-teal-500/10 ring-1 ring-teal-500/20" : roleDisplay.color.includes("yellow") ? "bg-yellow-500/10 ring-1 ring-yellow-500/20" : roleDisplay.color.includes("indigo") ? "bg-indigo-500/10 ring-1 ring-indigo-500/20" : roleDisplay.color.includes("red") ? "bg-red-500/10 ring-1 ring-red-500/20" : "bg-gray-500/10 ring-1 ring-gray-500/20"}`}
              >
                <RoleIcon className={`h-5 w-5 ${roleDisplay.color}`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-base font-semibold"
                  >
                    {roleDisplay.label}
                  </Typography>
                  <Badge variant="outline" className="font-mono text-xs">
                    {role.name}
                  </Badge>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      System
                    </Badge>
                  )}
                </div>
                {role.description && (
                  <Typography
                    variant="small"
                    className="text-muted-foreground line-clamp-1 text-sm"
                  >
                    {role.description}
                  </Typography>
                )}
              </div>

              {/* Stats */}
              <div className="flex shrink-0 items-center gap-6">
                <div className="text-center">
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-xs font-medium"
                  >
                    Permissions
                  </Typography>
                  <Typography variant="small" className="text-lg font-bold">
                    {role.permissions?.length || 0}
                  </Typography>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManagePermissions(role)}
                  className="min-w-25"
                >
                  <Wrench className="mr-1.5 h-3.5 w-3.5" />
                  Manage
                </Button>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onManagePermissions(role)}>
                    <Wrench className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </DropdownMenuItem>
                  {canEdit && (
                    <DropdownMenuItem onClick={() => onEdit(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(role)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Role
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
