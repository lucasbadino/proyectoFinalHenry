import { Module } from "@nestjs/common";
import { ServiceProvidedController } from "./serviceProvided.controller";
import { ServiceProvidedService } from "./serviceProvided.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceProvided } from "./entities/serviceProvided.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ServiceProvided])],
    controllers: [ServiceProvidedController],
    providers: [ ServiceProvidedService],
    exports: [],
})
export class ServiceProvidedModule { }