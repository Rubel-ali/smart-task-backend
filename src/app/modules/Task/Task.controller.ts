import httpStatus from 'http-status';
import { TaskService } from './Task.service';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../User/user.interface';
import pick from '../../../shared/pick';

const createTask = catchAsync(async (req, res) => {
  const result = await TaskService.createIntoDb({
    ...req.body,
    assignedToId: (req.user as IUser)?.id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTaskList = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    "searchTerm",
    "status",
    "projectId",
    "assignedToId",
  ]);

  const options = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await TaskService.getListFromDb(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task list retrieved successfully",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task details retrieved successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateIntoDb(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.deleteItemFromDb(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getTaskList,
  getTaskById,
  updateTask,
  deleteTask,
};