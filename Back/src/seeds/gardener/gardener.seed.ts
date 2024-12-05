import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Gardener } from "src/modules/gardener/entities/gardener.entity";
import { gardenersMock } from "./gardener.mock";
import { ServiceProvided } from "src/modules/serviceProvided/entities/serviceProvided.entity";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class GardenerSeed {
    constructor(
        @InjectRepository(Gardener)
        private readonly gardenerRepository: Repository<Gardener>,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(ServiceProvided)
        private readonly serviceProvidedRepository: Repository<ServiceProvided>,
    ) {}

    async seed() {
        const existingGardenerEmail = (await this.gardenerRepository.find()).map(
            (gardener) => gardener.email,
        );

        const services = await this.serviceProvidedRepository.find();

        for (const gardenerData of gardenersMock) {
            if (!existingGardenerEmail.includes(gardenerData.email)) {
                const carrouselImagesUrls = await Promise.all(
                    gardenerData.carrouselImages?.map((image) => 
                        this.cloudinaryService.getUrl(image)
                    ) || []
                );

                const gardener = this.gardenerRepository.create({
                    ...gardenerData,
                    password: await bcrypt.hash(gardenerData.password, 10),
                    profileImageUrl: await this.cloudinaryService.getUrl(gardenerData.profileImageUrl),
                    serviceProvided: services,
                    carrouselImages: carrouselImagesUrls, 
                });

                await this.gardenerRepository.save(gardener);
            }
        }
    }
}
