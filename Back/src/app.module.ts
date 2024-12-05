import { Module } from '@nestjs/common';
import { dataSource } from './config/data-sorce';
import { ServiceDetailsModule } from './modules/service-details/service-details.module';
import { GardenerModule } from './modules/gardener/gardener.module';
import { ServicesOrderModule } from './modules/services-order/services-order.module';
import { ServiceProvidedModule } from './modules/serviceProvided/serviceProvided.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SeedsModule } from './seeds/seeds.module';
import { AdminModule } from './modules/admin/admin.module';
import { MailModule } from './modules/mail/mail.module';
import { MercadopagoModule } from './modules/mercadopago/mercadopago.module';
import { TokenModule } from './modules/tokenServices/token.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    dataSource,
    ServiceDetailsModule,
    GardenerModule,
    UserModule,
    ServicesOrderModule,
    ServiceProvidedModule,
    AuthModule,
    SeedsModule,
    AdminModule,
    MercadopagoModule,
    MailModule,
    TokenModule,
    ReviewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
