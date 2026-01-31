"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { format } from "date-fns";
import { Typography } from "@/components/ui/typography";
import { ArrowUpDown } from "lucide-react";
import type { Task } from "@/features/tasks/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskTableViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityColors = {
  LOW: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
  MEDIUM: "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  TODO: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  IN_REVIEW:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function TaskTableView({ tasks, onTaskClick }: TaskTableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Ensure tasks is always an array
  const taskArray = Array.isArray(tasks) ? tasks : [];

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="min-w-50">
            <Typography
              variant="small"
              className="font-medium text-neutral-900 dark:text-neutral-100"
            >
              {row.original.title}
            </Typography>
            {row.original.description && (
              <Typography
                variant="muted"
                className="mt-1 line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400"
              >
                {row.original.description}
              </Typography>
            )}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              "shrink-0 rounded-sm text-[10px]",
              statusColors[row.original.status]
            )}
          >
            {row.original.status.replace("_", " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge
            className={cn(
              "shrink-0 rounded-sm text-[10px]",
              priorityColors[row.original.priority]
            )}
          >
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: "assigneeName",
        header: "Assigned To",
        cell: ({ row }) =>
          row.original.assigneeName ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex h-full w-full items-center justify-center text-xs font-medium">
                  {row.original.assigneeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </Avatar>
              <Typography
                variant="small"
                className="text-neutral-700 dark:text-neutral-300"
              >
                {row.original.assigneeName}
              </Typography>
            </div>
          ) : (
            <Typography variant="small" className="text-neutral-400">
              Unassigned
            </Typography>
          ),
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          row.original.dueDate ? (
            <Typography
              variant="small"
              className="text-neutral-700 dark:text-neutral-300"
            >
              {format(new Date(row.original.dueDate), "MMM dd, yyyy")}
            </Typography>
          ) : (
            <Typography variant="small" className="text-neutral-400">
              No due date
            </Typography>
          ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: taskArray,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-muted/50 rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-700 uppercase dark:text-neutral-300"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onTaskClick(row.original)}
                className="cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {taskArray.length === 0 && (
        <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
          No tasks found
        </div>
      )}
    </div>
  );
}
