export interface IProject {
  name: string;
  description: string;
  deadline: Date;
  status?: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  createdById: string;
}

export type IProjectsFilterRequest = {
  name?: string | undefined;
 description?: string | undefined;
  deadline?: string | undefined;
  status?: "ACTIVE" | "COMPLETED" | "ON_HOLD" | undefined;
  searchTerm?: string | undefined;
}