import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Categories } from "../enums/categories.enum";

export class CreateServiceProvidedDto {
    @IsNotEmpty()
    @IsString()
    detailService: string

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsArray()
    categories: Array<Categories>[]
}

export class UpdateServiceProvidedDto {

    @IsNotEmpty()
    @IsString()
    detailService?: string;

    @IsNotEmpty()
    @IsString()
    price?: number
    @IsArray()
    categories?: Categories[]


}