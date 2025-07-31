import { z } from "zod";
import { IParcelStatus } from "./parcel.interface";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const statusLogZodSchema = z.object({
    status: z.enum([...Object.values(IParcelStatus)] as [string, ...string[]], {
        required_error: "Status is required",
    }),
    location: z.string().optional(),
    note: z.string().optional(),
    timestamp: z.date().optional(),
    updatedBy: objectId,
});

export const createParcelZodSchema = z.object({
    body: z.object({
        senderId: objectId,
        receiverId: objectId,
        type: z.string({
            required_error: "Parcel type is required",
        }),
        weight: z.number({
            required_error: "Weight is required",
        }).positive("Weight must be a positive number"),
        deliveryAddress: z.string({
            required_error: "Delivery address is required",
        }),
        currentStatus: z.enum([...Object.values(IParcelStatus)] as [string, ...string[]], {
            required_error: "Current status is required",
        }),

        assignedDeliveryManId: objectId.optional(),
        fee: z.number().nonnegative("Fee must be 0 or more").optional(),
        deliveryDate: z.date().optional(),
        statusLogs: z.array(statusLogZodSchema).optional(),
        isCanceled: z.boolean().optional(),
        isDelivered: z.boolean().optional(),
        isBlocked: z.boolean().optional(),
    }),
});
