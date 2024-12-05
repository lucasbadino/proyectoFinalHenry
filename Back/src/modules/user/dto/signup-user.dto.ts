import { IsEmail, IsNotEmpty, Length, IsString, Matches, IsOptional, IsInt } from "class-validator";
import { Role } from "../enums/role.enum";

export class SignUpAuthDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 24)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&])[A-Za-z\d=!@#$%^&]{8,15}$/,
        {
            message: "La contraseña debe contener una minúscula, una mayúscula, un número y un símbolo"
        }
    )
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsInt()
    age: number;

    address: string;

    @IsOptional()
    role: Role;

    @IsOptional()
    isGoogle?: boolean;

    constructor(partial: Partial<SignUpAuthDto>) {
        Object.assign(this, partial);
    }
}
