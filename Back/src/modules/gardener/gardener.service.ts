import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGardenerDto } from './dto/create-gardener.dto';
import { UpdateGardenerDto } from './dto/update-gardener.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gardener } from './entities/gardener.entity';
import { Repository } from 'typeorm';
import { ServiceProvided } from '../serviceProvided/entities/serviceProvided.entity';
import { In } from 'typeorm';

@Injectable()
export class GardenerService {

  constructor(
    @InjectRepository(Gardener)
    private gardenerRepository: Repository<Gardener>,

    @InjectRepository(ServiceProvided)
    private serviceProvidedRepository: Repository<ServiceProvided>,
  ) { }

  async reserveDay(gardenerId: string, day: any) {
    try {
      const gardener = await this.gardenerRepository.findOne({ where: { id: gardenerId } });
      if (!gardener) throw new NotFoundException('Jardinero no encontrado');

      if (!gardener.reservedDays) gardener.reservedDays = [];

      const formattedDate = day.date;

      const isReserved = gardener.reservedDays.some((reservedDay: string) => reservedDay === formattedDate);

      if (isReserved) throw new BadRequestException('El día ya está reservado');

      gardener.reservedDays.push(formattedDate);

      await this.gardenerRepository.save(gardener);

      return { message: `Día reservado correctamente para el jardinero con ID ${gardenerId}` };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getReservedDays(id: string): Promise<string[]> {
    try {
      const gardener = await this.gardenerRepository.findOne({ where: { id } });

      if (!gardener) throw new HttpException('Jardinero no encontrado.', HttpStatus.NOT_FOUND);
      const formattedReservedDays = gardener?.reservedDays?.map((day) => day)
      if (!formattedReservedDays) return [];

      return formattedReservedDays;

    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createGardenerDto: CreateGardenerDto): Promise<Gardener> {
    try {
      const gardner = this.gardenerRepository.create(createGardenerDto);
      return await this.gardenerRepository.save(gardner);

    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    page: number,
    limit: number,
    name?: string,
    calification?: number,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Gardener[]; count: number }> {
    try {
      const skip = (page - 1) * limit;
      const query = this.gardenerRepository
        .createQueryBuilder('gardener')
        .leftJoinAndSelect('gardener.serviceProvided', 'serviceProvided')
        .leftJoinAndSelect('gardener.serviceDetails', 'serviceDetails')
        .take(limit)
        .skip(skip)
        .orderBy('gardener.name', order);

      if (name) query.andWhere('gardener.name ILIKE :name', { name: `%${name}%` });

      if (calification !== undefined) query.andWhere('gardener.calification = :calification', { calification });

      const [data, count] = await query.getManyAndCount();

      if (count === 0) throw new NotFoundException('Gardener not found');

      return { count, data };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<Gardener> {
    const gardner = await this.gardenerRepository.findOne({ 
      where: { id },
      relations: ['serviceProvided'] 
    });
    if (!gardner) {
      throw new NotFoundException(`Gardener with the ID ${id} not Found`);
    }
    return gardner;
  }


  findByEmail(email: string) {
    try {
      const gardener = this.gardenerRepository.findOne({ where: { email } });
      return gardener;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateServices(id: string, updateGardenerDto: UpdateGardenerDto): Promise<Gardener> {
    const { serviceProvided } = updateGardenerDto;

    if (!Array.isArray(serviceProvided)) {
      throw new BadRequestException('serviceProvided must be an array of service IDs');
  }
    // Encuentra el jardinero existente
    const gardener = await this.gardenerRepository.findOne({
      where: { id },
      relations: ['serviceProvided'],
    });

    if (!gardener) {
      throw new NotFoundException(`Gardener with ID ${id} not found`);
    }

    // Encuentra los servicios proporcionados por sus IDs
    const services = await this.serviceProvidedRepository.findBy({
      id: In(serviceProvided),
    });

    // Actualiza la relación
    gardener.serviceProvided = services;

    // Guarda los cambios
    return this.gardenerRepository.save(gardener);
  }
  
  async remove(id: string): Promise<string | void> {
    const result = await this.gardenerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gardener with the ID ${id} not Found`);
    }

    return `Gardner with the ID ${id} DELETED exitosly`;
  }

  async updateProfileImage(id: string, imageUrl: string): Promise<void> {
    await this.gardenerRepository.update(id, { profileImageUrl: imageUrl });
  }

  // Método para buscar gardeners por servicio
  async findByService(serviceId: string): Promise<Gardener[]> {
    return this.gardenerRepository
      .createQueryBuilder('gardener')
      .leftJoinAndSelect('gardener.services', 'service')
      .where('service.id = :serviceId', { serviceId })
      .getMany();
  }

  async findServicesProvidedByGardener(id: string) {
    const gardener = await this.gardenerRepository.findOne({
      where: { id },
      relations: ['serviceProvided'], // Asegura que se carguen los servicios relacionados
    });
  
    if (!gardener) {
      throw new NotFoundException(`Jardinero ${id} no encontrado`);
    }
  
    return gardener.serviceProvided;
  }
  

  async uploadCarrouselImages(id: string, imageUrl: string): Promise<void> {
    // Obtén el jardinero actual por su ID
    const gardener = await this.gardenerRepository.findOne({ where: { id } });

    if (!gardener) {
      throw new Error("Gardener not found");
    }

    const currentImages = gardener.carrouselImages || [];


    const updatedImages = [...currentImages, imageUrl];


    await this.gardenerRepository.update(id, { carrouselImages: updatedImages });
  }


  updateCarrouselImages(id: string, carrousel : string[] ) {
    
    return this.gardenerRepository.update(id, { carrouselImages: carrousel });
  }

  async findOrdersAsignedForGardener(id: string) {
    const gardener = await this.gardenerRepository.findOne({
      where: { id: id },
      relations: ['serviceDetails'],
    })

    if (!gardener) {
      throw new NotFoundException(`Jardinero ${id} no encontrado`);
    }

    return gardener.serviceDetails;

  }

  async updateGardener(id: string, updateGardenerDto: UpdateGardenerDto): Promise<Gardener> {
    const gardener = await this.gardenerRepository.findOne({
      where: { id },
      relations: ['serviceProvided'], // Cambia "services" a "serviceProvided"
    });

    if (!gardener) {
      throw new NotFoundException(`Gardener with ID ${id} not found`);
    }

    // Actualizar las propiedades del jardinero
    Object.assign(gardener, updateGardenerDto);

    if (updateGardenerDto.serviceProvided) {
      gardener.serviceProvided = updateGardenerDto.serviceProvided.map(serviceId => ({ id: serviceId } as any));
    }

    await this.gardenerRepository.save(gardener);
    return gardener;
  }

  async cancelReservation(gardenerId: string, day: string): Promise<void> {
    try {
      const gardener = await this.gardenerRepository.findOne({ where: { id: gardenerId } });
      if (!gardener) throw new NotFoundException('Jardinero no encontrado');
  
      if (!gardener.reservedDays || gardener.reservedDays.length === 0) {
        throw new BadRequestException('No hay días reservados para este jardinero');
      }
  
      gardener.reservedDays = gardener.reservedDays.filter((reservedDay) => reservedDay !== day);
  
      await this.gardenerRepository.save(gardener);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}

