import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from '../user/user.service';
import { AdminModule } from '../admin/admin.module';
import { GardenerModule } from '../gardener/gardener.module';
import { GardenerService } from '../gardener/gardener.service';
import { AdminService } from '../admin/admin.service';
import { AdminEntity } from '../admin/entities/admin.entity';
import { Gardener } from '../gardener/entities/gardener.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, AdminEntity, Gardener]), SharedModule, AdminModule, GardenerModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, GardenerService, AdminService],
})
export class AuthModule {}
