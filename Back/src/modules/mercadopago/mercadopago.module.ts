import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { ServicesOrderService } from '../services-order/services-order.service';
import { ServicesOrderModule } from '../services-order/services-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesOrderEntity } from '../services-order/entities/services-order.entity';
import { User } from '../user/entities/user.entity';
import { Gardener } from '../gardener/entities/gardener.entity';
import { ServiceProvided } from '../serviceProvided/entities/serviceProvided.entity';
import { AdminEntity } from '../admin/entities/admin.entity';
import { ServiceDetail } from '../service-details/entities/service-detail.entity';
import { TokenModule } from '../tokenServices/token.module';
import { MailModule } from '../mail/mail.module';
import { GardenerModule } from '../gardener/gardener.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ServicesOrderEntity,User, Gardener, ServiceProvided,AdminEntity,ServiceDetail]),
    TokenModule,MailModule,GardenerModule
  ],
  providers: [MercadoPagoService, ServicesOrderService],
  controllers: [MercadoPagoController],
})
export class MercadopagoModule { }
