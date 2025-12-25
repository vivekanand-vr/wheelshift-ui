"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { X, User, Save, Trash2 } from "lucide-react";
import type { Task, CreateTaskInput, Employee } from "@/features/tasks/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { AssignEmployeeModal } from "./AssignEmployeeModal";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000),
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
    "CANCELLED",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  tags: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (data: CreateTaskInput & { id?: string }) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function TaskDetailModal({
  open,
  onClose,
  task,
  onSave,
  onDelete,
  isLoading = false,
}: TaskDetailModalProps) {
  const [assignedEmployee, setAssignedEmployee] = useState<
    Employee | undefined
  >(task?.assignedTo);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "TODO",
      priority: task?.priority || "MEDIUM",
      dueDate: task?.dueDate
        ? format(new Date(task.dueDate), "yyyy-MM-dd")
        : "",
      startDate: task?.startDate
        ? format(new Date(task.startDate), "yyyy-MM-dd")
        : "",
      estimatedHours: task?.estimatedHours ?? undefined,
      tags: task?.tags?.join(", ") || "",
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    const tagsArray = values.tags
      ? values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Convert date strings to ISO format with time
    const formatDateToISO = (dateString?: string) => {
      if (!dateString) return undefined;
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19); // Returns format: 2025-12-26T17:30:00
    };

    onSave({
      id: task?.id,
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      dueDate: formatDateToISO(values.dueDate),
      startDate: formatDateToISO(values.startDate),
      estimatedHours: values.estimatedHours,
      assignedToId: assignedEmployee?.id
        ? String(assignedEmployee.id)
        : undefined,
      tags: tagsArray,
    });
  };

  const handleAssignEmployee = (employee: Employee) => {
    setAssignedEmployee(employee);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the task..."
                        className="min-h-25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="IN_REVIEW">In Review</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assigned To */}
              <div>
                <FormLabel>Assigned To</FormLabel>
                <div className="mt-2">
                  {assignedEmployee ? (
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {assignedEmployee.avatar ? (
                            <img
                              src={assignedEmployee.avatar}
                              alt={assignedEmployee.name}
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex h-full w-full items-center justify-center text-sm font-medium">
                              {assignedEmployee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {assignedEmployee.name}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {assignedEmployee.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAssignedEmployee(undefined)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAssignModal(true)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Assign Employee
                    </Button>
                  )}
                </div>
              </div>

              {/* Dates and Hours */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="frontend, bug-fix, urgent (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div>
                  {task && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onDelete(task.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {task ? "Update" : "Create"} Task
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AssignEmployeeModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSelect={handleAssignEmployee}
        currentAssigneeId={
          assignedEmployee?.id ? String(assignedEmployee.id) : undefined
        }
      />
    </>
  );
}
