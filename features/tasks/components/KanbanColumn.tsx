"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircle } from "lucide-react";
import type { KanbanColumn, Task } from "@/features/tasks/types";
import { SortableTaskCard } from "./SortableTaskCard";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

interface KanbanColumnProps {
  column: KanbanColumn;
  onTaskClick: (task: Task) => void;
  onCreateTask?: () => void;
}

export function KanbanColumnComponent({
  column,
  onTaskClick,
  onCreateTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div className="bg-muted/50 flex min-h-130 w-[320px] min-w-[320px] flex-col rounded-md">
      {/* Column Header */}
      <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${column.color}`} />
            <Typography
              variant="small"
              className="font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {column.title}
            </Typography>
          </div>
          <Badge variant="secondary" className="text-xs">
            {column.tasks.length}
          </Badge>
        </div>
      </div>

      {/* Tasks List */}
      <div
        ref={setNodeRef}
        className={`min-h-50 flex-1 space-y-3 overflow-y-auto p-3 transition-colors ${
          isOver ? "bg-primary-50/50 dark:bg-primary-900/10" : ""
        }`}
      >
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length > 0 ? (
            column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))
          ) : (
            <button
              onClick={onCreateTask}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <PlusCircle className="h-8 w-8" />
              <span className="text-sm font-medium">
                Click here to add task
              </span>
            </button>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
