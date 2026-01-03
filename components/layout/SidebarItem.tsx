"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { NavigationItem } from "@/lib/constants/navigation";

interface SidebarItemProps {
  item: NavigationItem;
  collapsed?: boolean;
}

export function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const ItemContent = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
        {!collapsed && (
          <>
            <Typography variant="small" className="flex-1 truncate font-medium">
              {item.title}
            </Typography>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
            "hover:bg-sidebar-hover dark:hover:bg-neutral-800",
            isActive && "bg-sidebar-active dark:bg-neutral-800",
            collapsed && "justify-center"
          )}
        >
          {ItemContent}
        </button>
        {isOpen && !collapsed && (
          <div className="mt-1 ml-4 space-y-1 border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
        "hover:bg-sidebar-hover dark:hover:bg-neutral-800",
        isActive
          ? "bg-sidebar-active text-sidebar-textActive dark:text-primary-400 dark:bg-neutral-800"
          : "text-sidebar-text dark:text-neutral-300",
        collapsed && "justify-center"
      )}
      title={collapsed ? item.title : undefined}
    >
      {ItemContent}
    </Link>
  );
}
