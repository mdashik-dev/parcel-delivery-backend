import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
    DELIVERY_MAN = "DELIVERY_MAN"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthUser {
    userId: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
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
