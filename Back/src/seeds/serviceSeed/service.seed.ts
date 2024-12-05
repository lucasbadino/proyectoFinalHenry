import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ServiceProvided } from "src/modules/serviceProvided/entities/serviceProvided.entity";
import { serviceMock } from "./service-mock";

@Injectable()
export class ServiceSeed {
    constructor(
        @InjectRepository(ServiceProvided)
        private readonly serviceRepository : Repository<ServiceProvided>,

    ){}

    async seed () {
        const existingServiceDetail = (await this.serviceRepository.find()).map(
            (service) => service.detailService
        )
       // Itera sobre los usuarios en el mock y guarda si no existen
       for (const serviceData of serviceMock) {
        if (!existingServiceDetail.includes(serviceData.detailService)) {
            const service = new ServiceProvided();
            service.categories = serviceData.categories;
            service.detailService = serviceData.detailService;
            service.price = serviceData.price;

            await this.serviceRepository.save(service); // Guarda el service si no existe
        }
    }
}
}