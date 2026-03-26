import {UserRepository} from "./provider/user.repository";
import {User} from "./entities/user.entity";
import {ReqCreateUserAg} from "./aggregate-objects/request-ag/req-create-user.ag";
import {NotFoundError} from "../../common-modules/errors";
import {ResUserAg} from "./aggregate-objects/response-ag/res-user.ag";
import {UserStatuses} from "../enums/user-statuses.enum";

export class UserService {
    async create(createUserAg: ReqCreateUserAg): Promise<ResUserAg> {
        const entity: User = UserRepository.create(createUserAg);
        const saved = await UserRepository.save(entity);
        return this.toResUserAg(saved);
    }

    async get(id: string): Promise<ResUserAg> {
        const entity = await this.findEntityById(id);
        return this.toResUserAg(entity);
    }

    async getByEmail(email: string): Promise<User> {
        const entity: User | null = await UserRepository.findOneBy({ email });
        if (!entity) throw new NotFoundError(`User with email ${email} not found`);
        return entity;
    }

    async getList(): Promise<ResUserAg[]> {
        const entities: User[] = await UserRepository.find();
        return entities.map((e) => this.toResUserAg(e));
    }

    async toggleStatus(id: string): Promise<ResUserAg> {
        const entity = await this.findEntityById(id);
        entity.status = entity.status === UserStatuses.ACTIVE ? UserStatuses.INACTIVE : UserStatuses.ACTIVE;
        const saved = await UserRepository.save(entity);
        return this.toResUserAg(saved);
    }

    private async findEntityById(id: string): Promise<User> {
        const entity: User | null = await UserRepository.findOneBy({ id });
        if (!entity) throw new NotFoundError(`User with id ${id} not found`);
        return entity;
    }

    private toResUserAg(user: User): ResUserAg {
        const { password: _, ...result } = user;
        return result;
    }
}