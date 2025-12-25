"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Row } from "@tanstack/react-table";
import type { Task } from "@/features/tasks/types";
import { cn } from "@/lib/utils";

interface SortableTableRowProps {
  row: Row<Task>;
  onClick: () => void;
}

export function SortableTableRow({ row, onClick }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
        isDragging && "opacity-50"
      )}
    >
      {row.getVisibleCells().map((cell, index) => (
        <td
          key={cell.id}
          className="px-4 py-3 text-sm"
          {...(index === 0 ? listeners : {})}
          onClick={index !== 0 ? onClick : undefined}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
