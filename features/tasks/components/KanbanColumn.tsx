"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { KanbanColumn, Task } from "@/features/tasks/types";
import { SortableTaskCard } from "./SortableTaskCard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  column: KanbanColumn;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumnComponent({
  column,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div className="bg-muted/50 flex min-h-120 w-[320px] min-w-[320px] flex-col rounded-lg">
      {/* Column Header */}
      <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${column.color}`} />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {column.title}
            </h3>
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
            <div className="flex h-32 items-center justify-center text-sm text-neutral-400 dark:text-neutral-600">
              No tasks
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
