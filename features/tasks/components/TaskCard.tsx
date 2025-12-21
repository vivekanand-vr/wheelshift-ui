"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "../types";
import { MoreVertical, Calendar, User } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  todo: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  "in-progress":
    "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
  done: "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200",
};

const priorityColors = {
  low: "text-neutral-600",
  medium: "text-warning-600",
  high: "text-error-600",
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base font-semibold">
            {task.title}
          </CardTitle>
          {task.description && (
            <Typography variant="muted" className="text-sm">
              {task.description}
            </Typography>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", statusColors[task.status])}>
            {task.status}
          </Badge>
          <span
            className={cn("text-xs font-medium", priorityColors[task.priority])}
          >
            {task.priority} priority
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
