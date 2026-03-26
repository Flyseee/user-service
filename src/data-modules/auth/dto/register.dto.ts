import {IsDate, IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import {Type} from "class-transformer";

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

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}