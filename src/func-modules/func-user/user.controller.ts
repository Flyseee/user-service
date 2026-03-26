import { Request, Response } from 'express';
import {UserService} from "../../data-modules/user/user.service";
import {ForbiddenError, UnauthorizedError} from "../../common-modules/errors";
import {StatusCodes} from "http-status-codes";
import {UserRoles} from "../../data-modules/enums/user-roles.enum";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async get(req: Request, res: Response): Promise<void> {
        const id = req.params['id'] as string;
        const currentUser = req.user;
        if (!currentUser) throw new UnauthorizedError('Access token not provided');

        if (currentUser.role !== UserRoles.ADMIN && currentUser.id !== id) {
            throw new ForbiddenError('You do not have access rights to this user.');
        }
        const user = await this.userService.get(id);
        res.status(StatusCodes.OK).json(user);
    }

    async getList(req: Request, res: Response): Promise<void> {
        const currentUser = req.user;
        if (!currentUser) throw new UnauthorizedError('Access token not provided');

        if (currentUser.role !== UserRoles.ADMIN) {
            throw new ForbiddenError('You do not have access rights to the user list.');
        }
        const users = await this.userService.getList();
        res.status(StatusCodes.OK).json(users);
    }

    async toggleStatus(req: Request, res: Response): Promise<void> {
        const id = req.params['id'] as string;
        const currentUser = req.user;
        if (!currentUser) throw new UnauthorizedError('Access token not provided');

        if (currentUser.role !== UserRoles.ADMIN && currentUser.id !== id) {
            throw new ForbiddenError('You do not have access rights to modify this user.');
        }
        const user = await this.userService.toggleStatus(id);
        res.status(StatusCodes.OK).json(user);
    }
}