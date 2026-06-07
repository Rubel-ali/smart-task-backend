import prisma from "../../../shared/prisma";
import { IActivity } from "./Activity.interface";

const createIntoDb = async (data: IActivity) => {
  const result = await prisma.activity.create({
    data,
  });

  return result;
};

const logActivity = async (
  action: string,
  userId: string,
  projectId?: string,
  taskId?: string
) => {
  return prisma.activity.create({
    data: {
      action,
      userId,
      projectId,
      taskId,
    },
  });
};

const getListFromDb = async (projectId?: string) => {
  const result = await prisma.activity.findMany({
    where: projectId
      ? {
          projectId,
        }
      : {},
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      project: true,
      task: true,
    },
  });

  return result;
};
export const ActivityService = {
  createIntoDb,
  logActivity,
  getListFromDb,
};
