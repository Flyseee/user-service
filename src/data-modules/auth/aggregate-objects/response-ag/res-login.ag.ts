import {User} from "../../../user/entities/user.entity";

export class ResLoginAg {
    accessToken!: string;
    refreshToken!: string;
    user!: User;
}