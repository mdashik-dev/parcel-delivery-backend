import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: true
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            secure: true,
        })
    }
}
