import { Request, Response, NextFunction } from "express";
import { Parcel } from "./parcel.model";
import { IAuthUser, Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

declare global {
    namespace Express {
        interface Request {
            user?: Partial<IAuthUser>;
            parcel?: any;
        }
    }
}


export const validateSenderParcelOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const userId = req.user?.userId;

    try {
        const parcel = await Parcel.findById(parcelId);

        if (!parcel) {
            return res.status(404).json({ message: "Parcel not found" });
        }

        if (parcel.senderId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied: You don't own this parcel" });
        }

        req.parcel = parcel;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};



export const validateReceiverParcelOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const parcelId = req.params.id;

    if (!user || !user.userId || user?.role !== Role.RECEIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "Access denied: Receiver only");
    }

    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.receiverId.toString() !== user.userId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not the receiver of this parcel");
    }

    req.parcel = parcel;

    next();
};