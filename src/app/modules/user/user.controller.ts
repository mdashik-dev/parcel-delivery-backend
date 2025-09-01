import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { UserServices } from "./user.service"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const user = await UserServices.createUser(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const result = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your profile Retrieved Successfully",
    data: result.data
  })
})
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await UserServices.getAllUsers(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta
  })
})

const getAllRecievers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = { role: 'RECEIVER' };
  const result = await UserServices.getAllUsers(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta
  })
})


const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const result = await UserServices.blockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User blocked successfully",
    data: result,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const result = await UserServices.unblockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User unblocked successfully",
    data: result,
  });
});
export const UserControllers = {
  createUser,
  getMe,
  getAllUsers,
  getAllRecievers,
  blockUser,
  unblockUser
}
