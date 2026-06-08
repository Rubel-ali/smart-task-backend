import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { NotificationRoutes } from "../modules/Notification/Notification.routes";
import passportRoutes from "../modules/Auth/passport.routes";
import { ProjectRoutes } from "../modules/Project/Project.routes";
import { TaskRoutes } from "../modules/Task/Task.routes";
import { ActivityRoutes } from "../modules/Activity/Activity.routes";
import { DashboardRoutes } from "../modules/Dashboard/Dashboard.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/auth",
    route: passportRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/tasks",
    route: TaskRoutes,
  },
  {
    path: "/activities",
    route: ActivityRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
