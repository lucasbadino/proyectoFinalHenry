import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedsModule } from './seeds/seeds.module';
import { UsersSeed } from './seeds/user/users.seed';
import { ServiceSeed } from './seeds/serviceSeed/service.seed';
import { loggsGlobal } from './middlewares/loggs.middleware';
import { GardenerSeed } from './seeds/gardener/gardener.seed';
import { AdminSeeder } from './seeds/admin/admin.seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(loggsGlobal);
  app.enableCors({
    origin: '*',
  });

//SWAGGER 

const swaggerConfig = new DocumentBuilder()
.setTitle("Vicnasol Docs")
.setDescription(
  "Servicio de Contratación de Jardinería. Nuestra plataforma permite a los usuarios contratar servicios profesionales de jardinería de manera fácil y rápida. Los clientes pueden registrarse, explorar una lista de jardineros disponibles, aplicar filtros para encontrar el servicio que mejor se adapte a sus necesidades, y realizar el pago de manera segura. Una vez contratado el servicio, un jardinero se desplazará a la ubicación indicada para llevar a cabo el trabajo. Por otro lado, los jardineros pueden registrarse en nuestra plataforma para crear un perfil que detalle sus servicios y disponibilidad. De esta forma, podrán ser contratados directamente por los clientes que busquen sus habilidades.\n\n" +
  "Funcionalidades clave:\n" +
  "  - **Clientes**: Registro, búsqueda de jardineros con filtros (por especialidad, ubicación, disponibilidad, etc.), contratación de servicios, y pagos online.\n" +
  "  - **Jardineros**: Registro, creación de perfil, gestión de servicios ofrecidos, y visibilidad para ser contratados.\n\n" +
  "La plataforma asegura una experiencia fluida tanto para clientes que buscan servicios de jardinería como para profesionales que desean ofrecer sus habilidades."
)

.setVersion("1.00")
.addBearerAuth()
.build()

const document = SwaggerModule.createDocument(app, swaggerConfig)
SwaggerModule.setup("docs", app, document)

  const adminSeed = app.select(SeedsModule).get(AdminSeeder);
  await adminSeed.seed();
  console.log("La inserción de administradores preestablecidos ha terminado.");

  const serviceSeed = app.select(SeedsModule).get(ServiceSeed);
  await serviceSeed.seed();
  console.log("La inserción de Servicios preestablecidos para Jardineros ha terminado.");

  const userSeed = app.select(SeedsModule).get(UsersSeed);
  await userSeed.seed();
  console.log("La inserción de Usuarios ha terminado.");

  const gardenerSeed = app.select(SeedsModule).get(GardenerSeed);
  await gardenerSeed.seed();
  console.log("La inserción de Jardineros ha terminado.");


  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
