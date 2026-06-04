import prisma from "../../../shared/prisma";
import { ITask } from "./Task.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";

const createIntoDb = async (data: ITask) => {
  const dueDate = new Date(data.dueDate);

  // ❌ invalid date
  if (isNaN(dueDate.getTime())) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid due date"
    );
  }

  // ❌ past date check
  if (dueDate <= new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Due date must be future date"
    );
  }

  // ❌ project check
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Project not found"
    );
  }

  // ❌ duplicate task title in same project
  const existingTask =
    await prisma.task.findFirst({
      where: {
        title: data.title,
        projectId: data.projectId,
      },
    });

  if (existingTask) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Task already exists in this project"
    );
  }

  const result = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || "",
      projectId: data.projectId,
      assignedToId: data.assignedToId || null,
      dueDate,
      priority: data.priority || "MEDIUM",
      status: data.status || "TODO"
    },
  });

  return result;
};

const getListFromDb = async (
  params: any,
  options: any
) => {
  const { page, limit, skip } = options;

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.TaskWhereInput[] = [];

  // 🔍 SEARCH (title + description)
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // 🎯 FILTERS (status, projectId, assignedToId)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.TaskWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  // 📦 FETCH DATA
  const result = await prisma.task.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      assignedTo: true
    },
  });

  // 📊 TOTAL COUNT
  const total = await prisma.task.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.task.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }

  // ❌ completed task restriction
  if (task.status === "COMPLETED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Completed tasks cannot be modified"
    );
  }

  const result = await prisma.task.update({
    where: { id },
    data,
  });

  return result;
};

const deleteItemFromDb = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }

  return prisma.task.delete({
    where: { id },
  });
};
export const TaskService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
