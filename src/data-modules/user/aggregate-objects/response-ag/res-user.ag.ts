import {UserStatuses} from "../../../enums/user-statuses.enum";
import {UserRoles} from "../../../enums/user-roles.enum";

export class ResUserAg {
    id!: string;
    firstName!: string;
    lastName!: string;
    secondName!: string;
    birthday!: Date;
    email!: string;
    role!: UserRoles;
    status!: UserStatuses;
}