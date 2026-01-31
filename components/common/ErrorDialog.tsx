"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, XCircle } from "lucide-react";

export type ErrorDialogType = "error" | "warning" | "info";

export interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  type?: ErrorDialogType;
  title: string;
  detail?: string;
  code?: string;
  timestamp?: string;
}

const typeConfig = {
  error: {
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    titleColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    titleColor: "text-yellow-900 dark:text-yellow-100",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
};

/**
 * Reusable Error Dialog Component
 * Displays API errors and warnings in a user-friendly format
 *
 * @example
 * ```tsx
 * <ErrorDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   type="error"
 *   title="Operation Not Allowed"
 *   detail="Cannot update system role"
 *   code="OPERATION_NOT_ALLOWED"
 * />
 * ```
 */
export function ErrorDialog({
  open,
  onClose,
  type = "error",
  title,
  detail,
  code,
  timestamp,
}: ErrorDialogProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div
            className={`${config.bgColor} mx-auto flex h-12 w-12 items-center justify-center rounded-full`}
          >
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <DialogTitle className={`text-center text-xl ${config.titleColor}`}>
            {title}
          </DialogTitle>
          {detail && (
            <DialogDescription className="text-center text-base">
              {detail}
            </DialogDescription>
          )}
        </DialogHeader>

        {(code || timestamp) && (
          <Card className={`${config.bgColor} ${config.borderColor} p-3`}>
            <div className="space-y-1 text-sm">
              {code && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground font-medium">
                    Error Code:
                  </span>
                  <code className="font-mono text-xs">{code}</code>
                </div>
              )}
              {timestamp && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground font-medium">
                    Timestamp:
                  </span>
                  <span className="font-mono text-xs">
                    {new Date(timestamp).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
