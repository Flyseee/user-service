import {ResUserAg} from "../../../user/aggregate-objects/response-ag/res-user.ag";

export class ResLoginAg {
    accessToken!: string;
    refreshToken!: string;
    user!: ResUserAg;
}