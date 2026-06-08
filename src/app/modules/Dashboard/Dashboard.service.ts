import prisma from "../../../shared/prisma";

const getSummaryFromDb = async () => {
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    totalUsers,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({
      where: { status: "ACTIVE" },
    }),
    prisma.project.count({
      where: { status: "COMPLETED" },
    }),
    prisma.task.count(),
    prisma.task.count({
      where: { status: "TODO" },
    }),
    prisma.task.count({
      where: { status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { status: "COMPLETED" },
    }),
    prisma.user.count(),
  ]);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    totalUsers,
  };
};

const getRecentProjectsFromDb = async () => {
  return prisma.project.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      status: true,
      deadline: true,
      createdAt: true,
    },
  });
};

const getRecentActivitiesFromDb = async () => {
  return prisma.activity.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

const getMyTasksFromDb = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      assignedToId: userId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });
};

const getProjectProgressFromDb = async () => {
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });

  return projects.map((project) => {
    const totalTasks = project.tasks.length;

    const completedTasks = project.tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    return {
      projectId: project.id,
      projectName: project.name,
      totalTasks,
      completedTasks,
      progress,
    };
  });
};

export const DashboardService = {
  getSummaryFromDb,
  getRecentProjectsFromDb,
  getRecentActivitiesFromDb,
  getMyTasksFromDb,
  getProjectProgressFromDb,
};