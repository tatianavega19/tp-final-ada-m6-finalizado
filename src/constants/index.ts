import dotenv from "dotenv"
dotenv.config()

export const URL = process.env.URL || "";
export const PORT = process.env.PORT || 45450;
export const PEPPER = process.env.PEPPER;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "";

if (!JWT_SECRET_KEY || !JWT_REFRESH_SECRET_KEY) {
    throw new Error('JWT secret keys are not defined in the environment variables');
}