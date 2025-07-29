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
