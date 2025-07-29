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
    _id?: Types.ObjectId,
    name: string;
    email: string;
    password: string;
    role: Role;
    isBlocked?: boolean;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: boolean;
}
