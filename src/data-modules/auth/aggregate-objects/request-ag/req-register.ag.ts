import {UserRoles} from "../../../enums/user-roles.enum";


export class ReqRegisterAg {
    firstName!: string;
    lastName!: string;
    secondName!: string;
    birthday!: Date;
    email!: string;
    password!: string;
    role!: UserRoles;
}