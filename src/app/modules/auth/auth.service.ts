import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";


export const loginUser = async (email: string, password: string): Promise<IUser> => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Incorrect password");
    }

    return user;
};

export const AuthServices = {
    loginUser
};