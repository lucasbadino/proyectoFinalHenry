import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GardenerModule } from '../gardener/gardener.module';
import { SharedModule } from 'src/shared/shared.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { ServicesOrderModule } from '../services-order/services-order.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GardenerModule, SharedModule, FileUploadModule,ServicesOrderModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
