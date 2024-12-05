import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { TokenController } from "./token.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServicesOrderEntity } from "../services-order/entities/services-order.entity";
import { ServiceDetail } from "../service-details/entities/service-detail.entity";

@Module({
    providers: [TokenService],
    exports: [TokenService],
    imports: [TypeOrmModule.forFeature([ServicesOrderEntity, ServiceDetail])],
    controllers: [TokenController],
})
export class TokenModule { }