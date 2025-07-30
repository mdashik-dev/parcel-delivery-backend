import { Types } from "mongoose";

export enum IParcelStatus {
    Requested = "Requested",
    Approved = "Approved",
    Dispatched = "Dispatched",
    InTransit = "In Transit",
    Delivered = "Delivered",
    Canceled = "Canceled",
}


export interface IStatusLog {
    status: IParcelStatus;
    location?: string;
    note?: string;
    timestamp?: Date;
    updatedBy: Types.ObjectId;
}

export interface IParcel {
    _id?: Types.ObjectId;
    trackingId: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;

    type: string;
    weight: number;
    fee: number;
    deliveryAddress: string;
    deliveryDate?: Date;

    currentStatus: IParcelStatus;
    statusLogs: IStatusLog[];

    isCanceled: boolean;
    isDelivered: boolean;
    isBlocked: boolean;

    assignedDeliveryManId: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateParcelPayload {
    trackingId: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    type: string;
    weight: number;
    fee: number;
    deliveryAddress: string;
    deliveryDate?: Date;
    currentStatus: IParcelStatus;
    statusLogs?: IStatusLog[];
    isCanceled?: boolean;
    isDelivered?: boolean;
    isBlocked?: boolean;
}