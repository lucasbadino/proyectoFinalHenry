// services-order.module.ts
import { Module } from '@nestjs/common';
import { ServicesOrderService } from './services-order.service';
import { ServicesOrderController } from './services-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesOrderEntity } from './entities/services-order.entity';
import { ServiceDetail } from '../service-details/entities/service-detail.entity';
import { ServiceProvided } from '../serviceProvided/entities/serviceProvided.entity';
import { User } from '../user/entities/user.entity';
import { Gardener } from '../gardener/entities/gardener.entity';
import { AdminEntity } from '../admin/entities/admin.entity';
import { TokenModule } from '../tokenServices/token.module';
import { MailModule } from '../mail/mail.module'; // Importar correctamente el MailModule
import { GardenerModule } from '../gardener/gardener.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicesOrderEntity, ServiceDetail, ServiceProvided, User, Gardener, AdminEntity]),
    TokenModule,
    MailModule, 
    GardenerModule
  ],
  controllers: [ServicesOrderController],
  providers: [ServicesOrderService],
  exports: [ServicesOrderService],
})
export class ServicesOrderModule {}
