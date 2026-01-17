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

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
  isSuperAdmin?: boolean;
}

export function RoleCard({
  role,
  onEdit,
  onDelete,
  onManagePermissions,
  isSuperAdmin,
}: RoleCardProps) {
  const canEdit = isSuperAdmin || !role.isSystem;
  const canDelete = isSuperAdmin && !role.isSystem;
  const roleDisplay = getRoleDisplay(role.name);
  const RoleIcon = roleDisplay.icon;

  return (
    <Card className="group hover:border-primary/50 relative overflow-hidden p-5 transition-all duration-200 hover:shadow-lg">
      {/* Background Gradient */}
      <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className={`rounded-xl p-2.5 ${roleDisplay.color.includes("purple") ? "bg-purple-500/10" : roleDisplay.color.includes("blue") ? "bg-blue-500/10" : roleDisplay.color.includes("green") ? "bg-green-500/10" : roleDisplay.color.includes("orange") ? "bg-orange-500/10" : roleDisplay.color.includes("teal") ? "bg-teal-500/10" : roleDisplay.color.includes("yellow") ? "bg-yellow-500/10" : roleDisplay.color.includes("indigo") ? "bg-indigo-500/10" : roleDisplay.color.includes("red") ? "bg-red-500/10" : "bg-gray-500/10"} ring-1 ring-inset ${roleDisplay.color.includes("purple") ? "ring-purple-500/20" : roleDisplay.color.includes("blue") ? "ring-blue-500/20" : roleDisplay.color.includes("green") ? "ring-green-500/20" : roleDisplay.color.includes("orange") ? "ring-orange-500/20" : roleDisplay.color.includes("teal") ? "ring-teal-500/20" : roleDisplay.color.includes("yellow") ? "ring-yellow-500/20" : roleDisplay.color.includes("indigo") ? "ring-indigo-500/20" : roleDisplay.color.includes("red") ? "ring-red-500/20" : "ring-gray-500/20"}`}
            >
              <RoleIcon className={`h-6 w-6 ${roleDisplay.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <Typography
                variant="small"
                className="truncate text-base font-semibold"
              >
                {roleDisplay.label}
              </Typography>
              <div className="mt-1 flex flex-col gap-1.5">
                <Badge variant="outline" className="w-fit font-mono text-xs">
                  {role.name}
                </Badge>
                {role.isSystem && (
                  <Badge variant="secondary" className="w-fit text-xs">
                    System
                  </Badge>
                )}
              </div>
            </div>
          </div>

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

        {/* Description */}
        {role.description && (
          <Typography
            variant="small"
            className="text-muted-foreground line-clamp-3 min-h-15 text-sm leading-relaxed"
          >
            {role.description}
          </Typography>
        )}

        {/* Divider */}
        <div className="border-t" />

        {/* Stats Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography
              variant="small"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              Permissions
            </Typography>
            <Typography variant="small" className="text-2xl font-bold">
              {role.permissions?.length || 0}
            </Typography>
          </div>

          {/* Manage Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePermissions(role)}
            className="text-primary hover:text-primary hover:bg-primary/10 w-full"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </div>
      </div>
    </Card>
  );
}
