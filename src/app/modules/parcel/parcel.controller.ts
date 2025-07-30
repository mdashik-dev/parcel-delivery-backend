import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { parcelServices } from "./parcel.service";
import { IParcel, IStatusLog } from "./parcel.interface";
import { IAuthUser, IUser } from "../user/user.interface";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: Partial<IAuthUser>;
        }
    }
}


const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await parcelServices.createParcel(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Created Successfully",
        data: parcel,
    });
});

const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await parcelServices.getAllParcels(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Parcels Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as Partial<IAuthUser> | undefined;

    if (!user) {
        return sendResponse<IParcel[]>(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Login to get your parcels",
            data: [],
        });
    }

    const parcels = await parcelServices.getMyParcels(user);

    sendResponse<IParcel[]>(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcels fetched successfully",
        data: parcels,
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return sendResponse<IParcel[]>(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Unauthorized: Please login to cancel parcel",
            data: [],
        });
    }

    const canceledParcel = await parcelServices.cancelParcel(id, userId);

    sendResponse<IParcel>(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel canceled successfully",
        data: canceledParcel,
    });
});

const confirmParcel = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IAuthUser | undefined;

    if (!user || !user.userId || !user.role) {
        sendResponse(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Unauthorized user",
            data: null,
        });
        return;
    }

    const { id: parcelId } = req.params;

    if (!parcelId) {
        sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Parcel ID is required",
            data: null,
        });
        return;
    }

    const parcel = await parcelServices.confirmParcel(parcelId, {
        _id: user.userId as unknown as Types.ObjectId,
        role: user.role,
    });

    sendResponse<IParcel>(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel confirmed successfully",
        data: parcel,
    });
});

const getIParcelStatusLogs = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const statusLogs = await parcelServices.getIParcelStatusLogs(id);

    sendResponse<IStatusLog[]>(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel status logs retrieved successfully",
        data: statusLogs,
    });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, location, note } = req.body;

    if (!status) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Status is required",
        });
        return;
    }

    const updatedParcel = await parcelServices.updateIParcelStatus(
        id,
        status,
        req.user?.userId as unknown as Types.ObjectId,
        location,
        note
    );

    sendResponse<IParcel>(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel status updated successfully",
        data: updatedParcel,
    });
});

const trackParcel = catchAsync(async (req: Request, res: Response) => {
    const { trackingId } = req.params;

    const parcel = await parcelServices.trackParcelByTrackingId(trackingId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel tracking info retrieved successfully",
        data: parcel,
    });
});

const deleteParcel = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const parcel = await parcelServices.deleteParcel(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel deleted successfully",
        data: parcel,
    });
});

export const ParcelControllers = {
    createParcel,
    getAllParcels,
    getMyParcels,
    cancelParcel,
    confirmParcel,
    getIParcelStatusLogs,
    updateParcelStatus,
    trackParcel,
    deleteParcel
};
