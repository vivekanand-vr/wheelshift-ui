export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
}

export interface TaskFilters {
  status?: Task["status"];
  priority?: Task["priority"];
  search?: string;
}
