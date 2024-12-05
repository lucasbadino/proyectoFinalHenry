import { Module } from '@nestjs/common';
import { ServiceDetailsService } from './service-details.service';
import { ServiceDetailsController } from './service-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetail } from './entities/service-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceDetail])],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
