import { Request, Response } from 'express';
import {UserService} from "../../data-modules/user/user.service";
import {BadRequestError, ForbiddenError, UnauthorizedError} from "../../common-modules/errors";
import {StatusCodes} from "http-status-codes";
import {UserRoles} from "../../data-modules/enums/user-roles.enum";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async get(req: Request, res: Response){
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new BadRequestError("Invalid request: ID should be a single value.");
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Access token not provided');
        }
        const userFromToken = this.userService.getUserFromToken(token);

        if (userFromToken.role !== UserRoles.ADMIN && userFromToken.id !== id) {
            throw new ForbiddenError("You do not have access rights to this user.");
        }
        const user = await this.userService.get(id);
        res.status(StatusCodes.OK).json(user);
    }

    async getList(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Access token not provided');
        }
        const userFromToken = this.userService.getUserFromToken(token);

        if (userFromToken.role !== UserRoles.ADMIN) {
            throw new ForbiddenError("You do not have access rights to the user list.");
        }
        const users = await this.userService.getList();
        res.status(StatusCodes.OK).json(users);
    }

    async toggleStatus(req: Request, res: Response) {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new BadRequestError("Invalid request: ID should be a single value.");
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Access token not provided');
        }
        const userFromToken = this.userService.getUserFromToken(token);

        if (userFromToken.role !== UserRoles.ADMIN && userFromToken.id !== id) {
            throw new ForbiddenError("You do not have access rights to modify this user.");
        }
        const user = await this.userService.toggleStatus(id);
        res.status(StatusCodes.OK).json(user);
    }
}