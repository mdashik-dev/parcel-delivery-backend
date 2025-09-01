import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";
import { IsActive, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";

export const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS))

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    })

    return user

}
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};
const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};


export const blockUser = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isActive === IsActive.BLOCKED) {
        throw new Error("User is already blocked");
    }

    user.isActive = IsActive.BLOCKED;
    await user.save();

    return user;
};


export const unblockUser = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isActive !== IsActive.BLOCKED) {
        throw new Error("User is already unblocked");
    }

    user.isActive = IsActive.ACTIVE;
    await user.save();

    return user;
};
export const UserServices = {
    createUser,
    getMe,
    getAllUsers,
    blockUser,
    unblockUser
}