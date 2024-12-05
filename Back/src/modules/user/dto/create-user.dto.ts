import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Min, Matches, IsOptional } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @Matches(
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[=!@#$%^&])[A-Za-z\d=!@#$%^&]{8,15}$/,
    {
      message:
        "La contraseña debe contener una minuscula, una mayuscula, un numero, un simbolo"
    }
  )
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Age must be a positive number' })
  age: number;

  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Phone number is not valid' })
  phone: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  address: string

  @IsOptional()
  isGoogle?: boolean;

  @IsEnum(Role, { message: 'Role must be either User, Admin or Gardener' })
  role?: Role;

  @IsOptional()
  profileImageUrl?: string
}
