import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {UnauthorizedError} from "../errors";

export const AuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Access token not provided'));
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err) => {
        if (err) {
            return next(new UnauthorizedError('Invalid access token'));
        }
        next();
    });
};