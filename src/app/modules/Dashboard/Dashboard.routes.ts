import express from "express";
import auth from "../../middlewares/auth";
import { DashboardController } from "./Dashboard.controller";

const router = express.Router();

router.get(
  "/summary",
  auth(),
  DashboardController.getSummary
);

router.get(
  "/recent-projects",
  auth(),
  DashboardController.getRecentProjects
);

router.get(
  "/activities",
  auth(),
  DashboardController.getRecentActivities
);

router.get(
  "/my-tasks",
  auth(),
  DashboardController.getMyTasks
);

router.get(
  "/project-progress",
  auth(),
  DashboardController.getProjectProgress
);


export const DashboardRoutes = router;
