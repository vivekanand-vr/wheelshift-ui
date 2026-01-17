"use client";

import { RoleCard } from "./RoleCard";
import type { Role } from "../types";

interface RolesGridViewProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
  isSuperAdmin?: boolean;
}

export function RolesGridView({
  roles,
  onEdit,
  onDelete,
  onManagePermissions,
  isSuperAdmin,
}: RolesGridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
          onManagePermissions={onManagePermissions}
          isSuperAdmin={isSuperAdmin}
        />
      ))}
    </div>
  );
}
