import {AppDataSource} from "../../../database-modules/provider/data-source";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";

export const UserRepository: Repository<User> = AppDataSource.getRepository(User);