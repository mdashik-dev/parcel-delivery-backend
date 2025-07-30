import AppError from "../../errorHelpers/AppError";
import { calculateFee } from "../../utils/calculateFee";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IAuthUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { CreateParcelPayload, IParcel, IStatusLog, IParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";


export const createParcel = async (payload: CreateParcelPayload): Promise<IParcel> => {
    const sender = await User.findById({ _id: payload.senderId });

    if (!sender || sender.role !== Role.SENDER as any) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid sender ID or sender is not allowed to send parcels");
    }

    const receiver = await User.findById({ _id: payload.receiverId });
    if (!receiver || receiver.role !== Role.RECEIVER as unknown as typeof receiver.role) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid receiver ID or user is not a receiver");
    }

    payload.trackingId = generateTrackingId();
    if (!payload.statusLogs) {
        const initialLog: IStatusLog = {
            status: payload.currentStatus,
            updatedBy: payload.senderId,
            timestamp: new Date(),
        };
        payload.statusLogs = [initialLog];
    }

    const parcel = new Parcel(payload);
    parcel.fee = calculateFee(Number(payload.weight), "city").toFixed(2) as unknown as number;
    await parcel.save();

    return parcel.toObject();
};

export const getAllParcels = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder<IParcel>(Parcel.find(), query);

    const parcelsQuery = queryBuilder
        .filter(["status", "type"])
        .search(["trackingId", "type", "deliveryAddress"])
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        parcelsQuery.build(),
        queryBuilder.getMeta(),
    ]);

    return {
        data,
        meta,
    };
};

export const getMyParcels = async (user: Partial<IAuthUser>): Promise<IParcel[]> => {
    if (!user || !user.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    let query = {};
    if (user.role === Role.SENDER) {
        query = { senderId: user.userId };
    } else if (user.role === Role.RECEIVER) {
        query = { receiverId: user.userId };
    } else {
        throw new AppError(httpStatus.FORBIDDEN, 'Only sender or receiver can access this route');
    }
    const parcels = await Parcel.find(query);

    return parcels.map(parcel => parcel.toObject());
};


export const cancelParcel = async (parcelId: string, userId: string): Promise<IParcel> => {
    const parcel = await Parcel.findOne({ _id: parcelId, senderId: userId });

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found or unauthorized");
    }

    if (parcel.currentStatus === "Dispatched" || parcel.currentStatus === "In Transit" || parcel.currentStatus === "Delivered") {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot cancel a parcel that has already ${parcel.currentStatus}.`);
    }

    parcel.isCanceled = true;
    parcel.currentStatus = IParcelStatus.Canceled;

    parcel.statusLogs.push({
        status: IParcelStatus.Canceled,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(userId),
        note: "Parcel canceled by user",
    });

    await parcel.save();
    return parcel.toObject();
};

const confirmParcel = async (parcelId: string, user: { _id: Types.ObjectId; role: Role }) => {
    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.currentStatus !== IParcelStatus.Requested) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot confirm parcel. Current status is '${parcel.currentStatus}'`
        );
    }

    if (parcel.isCanceled) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot confirm a canceled parcel");
    }

    if (parcel.isDelivered) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot confirm a delivered parcel");
    }

    if (user.role !== Role.RECEIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to confirm parcels");
    }

    const statusLog: IStatusLog = {
        status: IParcelStatus.Approved,
        timestamp: new Date(),
        updatedBy: user._id,
    };

    parcel.currentStatus = IParcelStatus.Approved;
    parcel.statusLogs.push(statusLog);
    await parcel.save();

    return parcel.toObject();
};

const getIParcelStatusLogs = async (parcelId: string): Promise<IStatusLog[]> => {
    if (!Types.ObjectId.isValid(parcelId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid parcel ID");
    }

    const parcel = await Parcel.findById(parcelId).select("statusLogs");

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    return parcel.statusLogs;
};

const validStatusFlow: Record<string, string> = {
    Requested: IParcelStatus.Approved,
    Approved: IParcelStatus.Dispatched,
    Dispatched: IParcelStatus.InTransit,
    "In Transit": IParcelStatus.Delivered
};

const updateIParcelStatus = async (parcelId: string, newStatus: IParcelStatus, updatedBy: Types.ObjectId, location?: string, note?: string): Promise<IParcel> => {
    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.isDelivered) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel has already been delivered");
    }

    if (parcel.isCanceled) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel has been canceled");
    }

    if (parcel.currentStatus === newStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, `Parcel is already marked as '${newStatus}'`);
    }

    const expectedNextStatus = validStatusFlow[parcel.currentStatus];
    if (expectedNextStatus !== newStatus) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invalid status transition from '${parcel.currentStatus}' to '${newStatus}'. Expected next status: '${expectedNextStatus}'.`
        );
    }

    const newLog: IStatusLog = {
        status: newStatus,
        updatedBy,
        timestamp: new Date(),
        location,
        note,
    };

    parcel.statusLogs.push(newLog);
    parcel.currentStatus = newStatus;

    if (newStatus === "Delivered") {
        parcel.isDelivered = true;
    }

    if (newStatus === "Canceled") {
        parcel.isCanceled = true;
    }

    await parcel.save();
    return parcel.toObject();
};

const trackParcelByTrackingId = async (trackingId: string): Promise<IParcel> => {
    if (!trackingId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tracking ID is required");
    }

    const parcel = await Parcel.findOne({ trackingId }).select("trackingId currentStatus statusLogs deliveryDate")

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    return parcel.toObject();
};

const deleteParcel = async (id: string): Promise<IParcel> => {
    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel ID is required");
    }

    const parcel = await Parcel.findOneAndDelete({ _id: id });

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }


    return parcel.toObject();
};

export const parcelServices = {
    createParcel,
    getAllParcels,
    getMyParcels,
    cancelParcel,
    confirmParcel,
    getIParcelStatusLogs,
    updateIParcelStatus,
    trackParcelByTrackingId,
    deleteParcel
}