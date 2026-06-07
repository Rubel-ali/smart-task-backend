import httpStatus from "http-status";
import { ActivityService } from "./Activity.service";
import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";

const getActivities = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.query;

  const result =
    await ActivityService.getListFromDb(
      projectId as string
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activities fetched successfully",
    data: result,
  });
});

export const ActivityController = {
  getActivities,
};
