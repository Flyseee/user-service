import {UserRepository} from "./provider/user.repository";
import {User} from "./entities/user.entity";
import {ReqCreateUserAg} from "./aggregate-objects/request-ag/req-create-user.ag";
import {ForbiddenError, NotFoundError} from "../../common-modules/errors";
import jwt from "jsonwebtoken";
import {ResGetUserFromTokenAg} from "./aggregate-objects/response-ag/res-get-user-from-token.ag";
import {ResUserAg} from "./aggregate-objects/response-ag/res-user.ag";
import {UserStatuses} from "../enums/user-statuses.enum";

export class UserService {
    async create(createUserAg: ReqCreateUserAg): Promise<ResUserAg> {
        const entity: User = UserRepository.create(createUserAg);
        return UserRepository.save(entity);
    }

    async get(id: string): Promise<ResUserAg> {
        const entity: User | null = await UserRepository.findOneBy({ id });
        if (!entity) throw new NotFoundError(`User with id ${id} not found`);
        return entity;
    }

    async getByEmail(email: string): Promise<ResUserAg> {
        const entity: User | null = await UserRepository.findOneBy({ email });
        if (!entity) throw new NotFoundError(`User with email ${email} not found`);
        return entity;
    }

    async getList(): Promise<ResUserAg[]> {
        const entities: User[] = await UserRepository.find();
        return entities;
    }

    async toggleStatus(id: string): Promise<ResUserAg> {
        const user: User = await this.get(id);
        user.status = (user.status === UserStatuses.ACTIVE) ? UserStatuses.INACTIVE : UserStatuses.ACTIVE;
        return UserRepository.save(user);
    }

    getUserFromToken(token: string): ResGetUserFromTokenAg {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ResGetUserFromTokenAg;
            if (!decoded) {
                throw new ForbiddenError("Token is invalid");
            }
            return decoded;
        } catch (error) {
            throw error;
        }
    }
}