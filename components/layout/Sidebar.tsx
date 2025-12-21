"use client";

import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarItem } from "./SidebarItem";
import { getNavigationForRole } from "@/lib/constants/navigation";
import { useAuth } from "@/lib/redux/features/auth/hooks";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = user?.role ? getNavigationForRole(user.role) : [];

  return (
    <aside
      className={cn(
        "border-border bg-sidebar-background flex flex-col border-r transition-all duration-300 dark:bg-neutral-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand */}
      <div className="border-border flex items-center justify-between border-b p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg text-white">
              <Zap className="h-5 w-5" />
            </div>
            <Typography variant="h3" className="text-lg font-bold">
              WheelShift
            </Typography>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      {!collapsed && user && (
        <div className="border-border border-t p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex h-10 w-10 items-center justify-center rounded-full font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="truncate font-medium">
                {user.name}
              </Typography>
              <Typography variant="muted" className="truncate text-xs">
                {user.role}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
