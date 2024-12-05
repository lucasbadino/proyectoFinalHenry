import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { ServicesOrderModule } from '../services-order/services-order.module';
import { MailController } from './mail.controller';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService], 
  controllers: [MailController],
})
export class MailModule {}
