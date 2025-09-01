import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/createUserTokens";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { setAuthCookie } from "../../utils/setAuthCookie";


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.loginUser(req.body.email, req.body.password);

    if (!user) {
        return next(new AppError(401, "User not found or password incorrect"));
    }
    const userTokens = await createUserTokens(user)

    const { password: pass, ...rest } = user.toObject();

    setAuthCookie(res, userTokens)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest

        },
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

export const AuthControllers = {
    loginUser,
    logout
}