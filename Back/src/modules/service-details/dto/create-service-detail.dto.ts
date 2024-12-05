import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateServiceDetailDto {
  @IsNotEmpty()
  @IsString()
  serviceType: string[];

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  totalPrice: number;

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsOptional()
  userToken?: string;

  @IsOptional()
  gardenerToken?: string;

  @IsOptional()
  @IsString()
  status?: string = 'Pendiente';

  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(0, { message: 'Rating must be at least 0' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating?: number;
}
