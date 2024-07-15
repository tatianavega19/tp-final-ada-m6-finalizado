import { Request, Response, NextFunction } from "express";
import {
    generateAccessToken,
    verifyToken,
    verifyRefreshToken,
} from "../utils/jwt";
import Auth from "../model/auth";

async function validateUserAccessToken(userId: string, apiAccessToken: string) {
    const user = await Auth.getUser(userId);
    if (!user) return user;
    const { accessToken } = user.dataValues;
    return accessToken == apiAccessToken;
}
async function validateUserRefreshToken(
    userId: string,
    apiRefreshToken: string
) {
    const user = await Auth.getUser(userId);
    if (!user) return user;
    const { refreshToken } = user.dataValues;
    return refreshToken == apiRefreshToken;
}

async function authorizeUser(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.headers["authorization"] as string;
    const refreshToken = req.cookies["refreshToken"];
    if (!accessToken && !refreshToken) {
        return res.status(401).send("Access Denied. No token provided.");
    }

    try {
        const decoded = verifyToken(accessToken) as any;
        if (!(await validateUserAccessToken(decoded.data, accessToken)))
            return res.status(404).json({ error: "Wrong Credentials" });
        next();
    } catch (error) {
        try {
            const refresh = verifyRefreshToken(refreshToken) as any;
            if (!(await validateUserRefreshToken(refresh.data, refreshToken)))
                return res.status(404).json({ error: "Wrong Credentials" });

            const newAccessToken = generateAccessToken(refresh.data);

            try {
                await Auth.updateUserAccessToken(refresh.data, newAccessToken);
                res
                    .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                    })
                    .set("Authorization", newAccessToken);
                next();
            } catch (error) {
                return res
                    .status(400)
                    .json({ error: "An error occured, please login again" });
            }
        } catch (error) {
            res.status(400).json({ message: "Expired session, please login again" });
        }
    }
}

export { authorizeUser };