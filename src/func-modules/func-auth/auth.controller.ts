import { Request, Response } from 'express';
import {AuthService} from "../../data-modules/auth/auth.service";
import {RegisterDto} from "../../data-modules/auth/dto/register.dto";
import {validate} from "class-validator";
import {StatusCodes} from "http-status-codes";
import {LoginDto} from "../../data-modules/auth/dto/login.dto";
import {ResLoginAg} from "../../data-modules/auth/aggregate-objects/response-ag/res-login.ag";
import {UnauthorizedError, ValidationError} from "../../common-modules/errors";
import {ResRefreshTokenAg} from "../../data-modules/auth/aggregate-objects/response-ag/res-refresh-token.ag";
import {plainToInstance} from "class-transformer";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async register(req: Request, res: Response){
        const registerDto: RegisterDto = plainToInstance(RegisterDto, req.body);
        const validationErrors = await validate(registerDto);
        if (validationErrors.length > 0) {
            const messages = validationErrors.map(error => {
                return error.constraints ? Object.values(error.constraints).join(', ') : 'Unknown validation error';
            });
            throw new ValidationError(`Validation failed: ${messages.join('; ')}`);
        }

        try {
            await this.authService.register(registerDto);
            res.status(StatusCodes.CREATED).json({
                message: 'User registered successfully',
            })
        } catch (error) {
            throw error;
        }
    }

    async login(req: Request, res: Response){
        const loginDto: LoginDto = plainToInstance(LoginDto, req.body);
        const validationErrors = await validate(loginDto);
        if (validationErrors.length > 0) {
            const messages = validationErrors.map(error => {
                return error.constraints ? Object.values(error.constraints).join(', ') : 'Unknown validation error';
            });
            throw new ValidationError(`Validation failed: ${messages.join('; ')}`);
        }

        try {
            const loginRes: ResLoginAg = await this.authService.login(loginDto);
            res.status(StatusCodes.OK).json({...loginRes});
        } catch (error) {
            throw error;
        }
    }

    async refreshToken(req: Request, res: Response) {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Access token not provided');
        }

        try {
            const refreshRes: ResRefreshTokenAg = await this.authService.refreshToken(token);
            res.status(StatusCodes.OK).json(refreshRes);
        } catch (error) {
            throw error;
        }
    }
}