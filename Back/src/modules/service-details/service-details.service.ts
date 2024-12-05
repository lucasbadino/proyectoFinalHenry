import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDetailDto } from './dto/create-service-detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDetail } from './entities/service-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceDetailsService {
  constructor(
    @InjectRepository(ServiceDetail)
    private readonly serviceDetailRepository: Repository<ServiceDetail>,
  ) {}

  async create(createServiceDetailDto: CreateServiceDetailDto): Promise<ServiceDetail> {
    const serviceDetails = this.serviceDetailRepository.create(createServiceDetailDto);
    return await this.serviceDetailRepository.save(serviceDetails);
  }

  async findAll(page: number, limit: number): Promise<{ data: ServiceDetail[]; count: number }> {

    const skip = (page - 1) * limit;
    const [data, count] = await this.serviceDetailRepository.findAndCount({
      take: limit,
      skip: skip,
      relations: ['servicesOrder', "assignedGardener"],
    });

    if (count === 0) {
      throw new NotFoundException('No hay detalles de servicio almacenados');
    }
    return {count, data};
  }

  async findOne(id: string): Promise<ServiceDetail> {
    const detail = await this.serviceDetailRepository.findOneBy({ id });
    if (!detail) {
      throw new NotFoundException(`Detalle de servicio con id ${id} no encontrado`);
    }
    return detail;
  }

  async update(id: string, updateServiceDetailDto: UpdateServiceDetailDto): Promise<ServiceDetail> {
    const detail = await this.serviceDetailRepository.findOneBy({ id });
    if (!detail) {
      throw new NotFoundException(`Detalle de servicio con id ${id} no encontrado`);
    }
    await this.serviceDetailRepository.update(id, updateServiceDetailDto);
    return this.serviceDetailRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceDetailRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Detalle de servicio con id ${id} no encontrado`);
    }
  }
}
