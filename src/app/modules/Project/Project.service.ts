import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IProject, IProjectsFilterRequest } from "./Project.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";

const createIntoDb = async (data: IProject) => {
  const deadline = new Date(data.deadline);

  // ❌ invalid date check
  if (isNaN(deadline.getTime())) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid deadline format"
    );
  }

  const now = new Date();

  // ❌ past deadline validation
  if (deadline.getTime() <= now.getTime()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Deadline must be a future date"
    );
  }

  const result = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      deadline,
      status: data.status || "ACTIVE",
      createdById: data.createdById,
    },
  });

  return result;
};

const getListFromDb = async (
  params: IProjectsFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  // 🔍 SEARCH (name + description)
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
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

  // 🎯 FILTER (status, createdById etc.)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProjectWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const result = await prisma.project.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      tasks: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const total = await prisma.project.count({
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
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Project not found"
    );
  }

  return project;
};

const updateIntoDb = async (
  id: string,
  data: Partial<IProject>
) => {
  const isExist = await prisma.project.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Project not found"
    );
  }

  // ❌ validation: deadline check
  if (data.deadline) {
    const deadline = new Date(data.deadline);

    if (deadline < new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Deadline must be a future date"
      );
    }
  }

  const result = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline
        ? new Date(data.deadline)
        : undefined,
    },
  });

  return result;
};

const deleteItemFromDb = async (id: string) => {
  const isExist = await prisma.project.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Project not found"
    );
  }

  const result = await prisma.project.delete({
    where: { id },
  });

  return result;
};

const addMemberIntoProject = async (
  projectId: string,
  userId: string
) => {
  // check project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Project not found"
    );
  }

  // check user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  // duplicate member check
  const existing =
    await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already a member of this project"
    );
  }

  const result =
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });

  return result;
};

export const ProjectService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
  addMemberIntoProject,
};
