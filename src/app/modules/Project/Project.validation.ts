import { z } from "zod";

const createSchema = z.object({
  name: z
    .string({
      required_error: "Project name is required",
    })
    .min(3, "Name must be at least 3 characters"),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, "Description must be at least 10 characters"),

  deadline: z
    .string({
      required_error: "Deadline is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  status: z
    .enum(["ACTIVE", "COMPLETED", "ON_HOLD"])
    .optional(),
});

const updateSchema = z.object({
  name: z.string().min(3).optional(),

  description: z.string().min(10).optional(),

  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),

  status: z
    .enum(["ACTIVE", "COMPLETED", "ON_HOLD"])
    .optional(),
});

const addMemberSchema = z.object({
  userId: z.string({
    required_error: "User ID is required",
  }),
  role: z
    .enum(["ADMIN", "PROJECT_MANAGER", "MEMBER"])
    .optional(),
});

export const ProjectValidation = {
  createSchema,
  updateSchema,
  addMemberSchema,
};