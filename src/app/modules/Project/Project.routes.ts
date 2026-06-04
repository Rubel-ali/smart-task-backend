import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectController } from "./Project.controller";
import { ProjectValidation } from "./Project.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(ProjectValidation.createSchema),
  ProjectController.createProject,
);

router.get("/", auth(), ProjectController.getProjectList);

router.get("/:id", auth(), ProjectController.getProjectById);

router.put(
  "/:id",
  auth(),
  validateRequest(ProjectValidation.updateSchema),
  ProjectController.updateProject,
);

router.delete("/:id", auth(), ProjectController.deleteProject);

export const ProjectRoutes = router;
