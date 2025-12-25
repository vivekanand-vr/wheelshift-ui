"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Task } from "@/features/tasks/types";
import { Calendar, Tag, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

const priorityColors = {
  LOW: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
  MEDIUM: "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer border border-neutral-200 transition-all hover:shadow-md dark:border-neutral-700",
        isDragging && "ring-primary-500 shadow-2xl ring-2"
      )}
    >
      <CardContent className="space-y-3 px-4 py-2">
        {/* Header with drag handle and priority */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
            <h4 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {task.title}
            </h4>
          </div>
          <Badge
            className={cn(
              "shrink-0 rounded-sm text-[10px]",
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </Badge>
        </div>
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="h-3 w-3 text-neutral-500" />
            {task.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer with assignee and dates */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {task.assigneeName ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex h-full w-full items-center justify-center text-xs font-medium">
                    {task.assigneeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </Avatar>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {task.assigneeName.split(" ")[0]}
                </span>
              </div>
            ) : (
              <span className="text-xs text-neutral-400">Unassigned</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
