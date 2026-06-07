import prisma from "../../../shared/prisma";

export const createActivity = async (
  action: string,
  userId: string,
  projectId?: string,
  taskId?: string,
) => {
  await prisma.activity.create({
    data: {
      action,
      userId,
      projectId,
      taskId,
    },
  });
};
