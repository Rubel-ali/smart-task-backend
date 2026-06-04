import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3, "Task title required"),

  description: z.string().optional(),

  projectId: z.string({
    required_error: "Project is required",
  }),

  assignedToId: z.string().optional(),

  dueDate: z
    .string({
      required_error: "Due date is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
});

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export const TaskValidation = {
  createSchema,
  updateSchema,
};
