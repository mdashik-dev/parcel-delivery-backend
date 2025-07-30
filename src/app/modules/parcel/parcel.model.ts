import { Schema, model } from "mongoose";
import { IParcel, IStatusLog, IParcelStatus } from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
    {
        status: {
            type: String,
            enum: Object.values(IParcelStatus),
            required: true,
        },
        location: {
            type: String,
        },
        note: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    { _id: false }
);

const ParcelSchema = new Schema<IParcel>(
    {
        trackingId: {
            type: String,
            required: true,
            unique: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        assignedDeliveryManId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        fee: {
            type: Number,
            required: true,
        },
        deliveryAddress: {
            type: String,
            required: true,
        },
        deliveryDate: {
            type: Date,
        },
        currentStatus: {
            type: String,
            enum: Object.values(IParcelStatus),
            required: true,
        },
        statusLogs: {
            type: [StatusLogSchema],
            default: [],
        },
        isCanceled: {
            type: Boolean,
            default: false,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Parcel = model<IParcel>("Parcel", ParcelSchema);
