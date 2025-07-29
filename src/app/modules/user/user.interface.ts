import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    toObject(): { [x: string]: any; password: any; };
    _id?: Types.ObjectId,
    name: string;
    email: string;
    password: string;
    role: Role;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: boolean;
}
