import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    isBlocked: { type: Boolean, default: false },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = model<IUser>("User", UserSchema)