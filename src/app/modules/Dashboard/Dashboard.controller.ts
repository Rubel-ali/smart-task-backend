import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './Dashboard.service';

const getSummary = catchAsync(async (req, res) => {
  const result =
    await DashboardService.getSummaryFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result,
  });
});

const getRecentProjects = catchAsync(async (req, res) => {
  const result =
    await DashboardService.getRecentProjectsFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent projects fetched successfully",
    data: result,
  });
});

const getRecentActivities = catchAsync(
  async (req, res) => {
    const result =
      await DashboardService.getRecentActivitiesFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recent activities fetched successfully",
      data: result,
    });
  }
);

const getMyTasks = catchAsync(async (req, res) => {
  const userId = (req.user as { id?: string })?.id;

  const result =
    await DashboardService.getMyTasksFromDb(userId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My tasks fetched successfully",
    data: result,
  });
});

const getProjectProgress = catchAsync(
  async (req, res) => {
    const result =
      await DashboardService.getProjectProgressFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project progress fetched successfully",
      data: result,
    });
  }
);

export const DashboardController = {
  getSummary,
  getRecentProjects,
  getRecentActivities,
  getMyTasks,
  getProjectProgress,
};