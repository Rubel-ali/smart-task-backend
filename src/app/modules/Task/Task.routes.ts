import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TaskController } from "./Task.controller";
import { TaskValidation } from "./Task.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(TaskValidation.createSchema),
  TaskController.createTask,
);

router.get("/", auth(), TaskController.getTaskList);

router.get("/:id", auth(), TaskController.getTaskById);

router.put(
  "/:id",
  auth(),
  validateRequest(TaskValidation.updateSchema),
  TaskController.updateTask,
);

router.delete("/:id", auth(), TaskController.deleteTask);

export const TaskRoutes = router;
