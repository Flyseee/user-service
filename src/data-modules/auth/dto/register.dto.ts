import {IsDate, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Type} from "class-transformer";
import {UserRoles} from "../../enums/user-roles.enum";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    secondName!: string;

    @IsDate()
    @Type(() => Date)
    birthday!: Date;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    password!: string;

    @IsEnum(UserRoles)
    role!: UserRoles;
}