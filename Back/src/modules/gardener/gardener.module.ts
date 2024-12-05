import { Module } from '@nestjs/common';
import { GardenerService } from './gardener.service';
import { GardenerController } from './gardener.controller';
import { Gardener } from './entities/gardener.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvided } from '../serviceProvided/entities/serviceProvided.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gardener, ServiceProvided])],
  controllers: [GardenerController],
  providers: [GardenerService],
  exports: [GardenerService, TypeOrmModule],
})
export class GardenerModule {}
