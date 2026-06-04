export interface ITask {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  dueDate: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
  createdById: string;
}

export type ITasksFilterRequest = {
  title?: string | undefined;
  description?: string | undefined;
  projectId?: string | undefined;
  assignedToId?: string | undefined;
  dueDate?: string | undefined;
  priority?: "HIGH" | "MEDIUM" | "LOW" | undefined;
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | undefined;
  searchTerm?: string | undefined;
};
