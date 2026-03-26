import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {UnauthorizedError} from "../errors";

export const AuthenticateMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Access token not provided'));
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            return next(new UnauthorizedError('Invalid access token'));
        }
        const payload = decoded as JwtPayload;
        req.user = { id: payload.id, role: payload.role };
        next();
    });
};