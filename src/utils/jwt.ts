import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from '../constants';


if (!JWT_SECRET_KEY || !JWT_REFRESH_SECRET_KEY) {
    throw new Error('JWT secret keys are not defined');
}

const generateAccessToken = (data: any) => {
    return jwt.sign({ data }, JWT_SECRET_KEY, { expiresIn: '1m' });
}

const generateRefreshToken = (data: any) =>
    jwt.sign({ data }, JWT_REFRESH_SECRET_KEY, { expiresIn: '15m' });

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
export {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
};