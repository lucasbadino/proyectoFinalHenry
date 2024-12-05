import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsUrl,
  Min,
  Max,
  IsUUID,
  IsEmail,
} from 'class-validator';

export class CreateGardenerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username : string;

  @IsString()
  password: string;

  @IsInt()
  age : number;

  @IsString()
  phone : string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  calification?: number;

  @IsString()
  @IsOptional()
  ubication?: string;

  @IsUrl()
  @IsOptional()
  profileImageUrl?: string;
}
