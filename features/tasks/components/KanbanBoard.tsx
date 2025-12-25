"use client";

import { useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import type { Task, TaskStatus, KanbanColumn } from "@/features/tasks/types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  onTaskClick: (task: Task) => void;
}

const COLUMNS: KanbanColumn[] = [
  { id: "TODO", title: "To Do", tasks: [], color: "bg-neutral-500" },
  { id: "IN_PROGRESS", title: "In Progress", tasks: [], color: "bg-blue-500" },
  { id: "IN_REVIEW", title: "In Review", tasks: [], color: "bg-yellow-500" },
  { id: "COMPLETED", title: "Completed", tasks: [], color: "bg-green-500" },
  { id: "CANCELLED", title: "Cancelled", tasks: [], color: "bg-red-500" },
];

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const columns = useMemo(() => {
    const taskArray = Array.isArray(tasks) ? tasks : [];
    return COLUMNS.map((col) => ({
      ...col,
      tasks: taskArray
        .filter((task) => task.status === col.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const taskArray = Array.isArray(tasks) ? tasks : [];
    const task = taskArray.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // This handles the visual feedback during drag
    console.log("Event Drag Over:", event);
    // TODO: Implement any visual feedback if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("Event Drag End:", event);
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskArray = Array.isArray(tasks) ? tasks : [];
    const activeTask = taskArray.find((t) => t.id === active.id);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    // Check if dropped over a column or another task
    let newStatus: TaskStatus;
    let newOrder: number;

    // If dropped over a column container
    if (over.id.toString().startsWith("column-")) {
      newStatus = over.id.toString().replace("column-", "") as TaskStatus;
      const columnTasks = taskArray.filter((t) => t.status === newStatus);
      newOrder = columnTasks.length;
    } else {
      // Dropped over another task
      const overTask = taskArray.find((t) => t.id === over.id);
      if (!overTask) {
        setActiveTask(null);
        return;
      }
      newStatus = overTask.status;
      newOrder = overTask.order;
    }

    // Only update if status or order changed
    if (activeTask.status !== newStatus || activeTask.order !== newOrder) {
      onTaskMove(activeTask.id, newStatus, newOrder);
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-80">
            <TaskCard task={activeTask} onClick={() => {}} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
