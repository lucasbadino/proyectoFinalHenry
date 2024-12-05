import {
  IsOptional,
  IsString,
  IsInt,
  IsUrl,
  Min,
  Max,
  IsEmail,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateGardenerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  phone?: string;

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

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  serviceProvided?: string[];

  @IsArray()
  @IsOptional()
  carrouselImages?: string[];
}

