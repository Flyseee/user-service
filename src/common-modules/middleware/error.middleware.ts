import { Request, Response, NextFunction } from 'express';
import {BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError} from '../errors';
import { StatusCodes } from 'http-status-codes';

export const ErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
    if (err instanceof UnauthorizedError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
    }
    if (err instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    if (err instanceof ForbiddenError) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: err.message });
    }
    if (err instanceof BadRequestError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: err.message,
    });
};