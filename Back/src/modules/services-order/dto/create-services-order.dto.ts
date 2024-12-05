import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceOrderDto {

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsOptional()
    isApproved?: boolean;

    @IsUUID()
    @IsNotEmpty()
    gardenerId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    serviceId?: string[];

}
