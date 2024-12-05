import { HttpException, Injectable } from "@nestjs/common";
import { ServiceProvided } from "./entities/serviceProvided.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateServiceProvidedDto } from "./Dtos/serviceProvided.dto";


@Injectable()
export class ServiceProvidedService {
 
    constructor(
        @InjectRepository(ServiceProvided)
        private readonly serviceProvidedRepository: Repository<ServiceProvided>,
    ) { }

    async getAllServiceProvidedService(
        name?: string,
        priceMin?: number,
        priceMax?: number,
        order: 'ASC' | 'DESC' = 'ASC'
      ) {
        try {
          const query = this.serviceProvidedRepository.createQueryBuilder('serviceProvided')
            .orderBy('serviceProvided.detailService', order); 
      
          // Filtro por nombre
          if (name) {
            query.andWhere('serviceProvided.detailService ILIKE :name', { name: `%${name}%` });
          }
      
          // Filtros por precio mínimo y máximo
          if (priceMin !== undefined) {
            query.andWhere('serviceProvided.price >= :priceMin', { priceMin });
          }
          if (priceMax !== undefined) {
            query.andWhere('serviceProvided.price <= :priceMax', { priceMax });
          }

          const allData = await query.getMany();
      
          return allData;
        } catch (error) {
          throw new HttpException(error, 400);
        }
      }

    async getServiceProvidedByIdService(id: string) {
        try {
            const data = await this.serviceProvidedRepository.findOne({ where: { id } });
            return data;
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    async createServiceProvidedService(createServiceProvidedDto: Omit<ServiceProvided, 'id'>) {
        try {
            const newServiceProvided = await this.serviceProvidedRepository.create(createServiceProvidedDto);
            return await this.serviceProvidedRepository.save(newServiceProvided);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    async updateServiceProvided(id: string, updateServiceProvidedDto: UpdateServiceProvidedDto) {
        const data = await this.serviceProvidedRepository.findOneBy({id});
        if (!data) {
            throw new HttpException('Servicio no encontrado', 400);
        }
        return await this.serviceProvidedRepository.update(data.id, updateServiceProvidedDto);

    }

   async deleteServiceProvided(id: string) {
        const data = await this.serviceProvidedRepository.findOneBy({id});
        if (!data) {
            throw new HttpException('Servicio no encontrado', 400);
        }
        return await this.serviceProvidedRepository.delete(id);
    }
}