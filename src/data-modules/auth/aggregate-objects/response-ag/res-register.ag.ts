import {UserRoles} from "../../../enums/user-roles.enum";
import {UserStatuses} from "../../../enums/user-statuses.enum";


export class ResRegisterAg {
    id!: string;
    firstName!: string;
    lastName!: string;
    secondName!: string;
    birthday!: Date;
    email!: string;
    password!: string;
    role!: UserRoles;
    status!: UserStatuses;
}