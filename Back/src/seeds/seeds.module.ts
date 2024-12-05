import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceProvided } from "src/modules/serviceProvided/entities/serviceProvided.entity";
import { User } from "src/modules/user/entities/user.entity";
import { UsersSeed } from "./user/users.seed";
import { ServiceSeed } from "./serviceSeed/service.seed";
import { GardenerSeed } from "./gardener/gardener.seed";
import { Gardener } from "src/modules/gardener/entities/gardener.entity";
import { AdminEntity } from "src/modules/admin/entities/admin.entity";
import { AdminSeeder } from "./admin/admin.seed";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { FileUploadModule } from "src/file-upload/file-upload.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([User, ServiceProvided, Gardener, AdminEntity]),
        FileUploadModule
    ],
    providers: [UsersSeed, ServiceSeed, GardenerSeed, AdminSeeder],
    exports: [UsersSeed, ServiceSeed, GardenerSeed, AdminSeeder]
})
export class SeedsModule { }