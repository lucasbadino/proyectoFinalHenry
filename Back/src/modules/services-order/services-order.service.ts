import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateServiceOrderDto } from './dto/create-services-order.dto';
import { UpdateServicesOrderDto } from './dto/update-services-order.dto';
import { ServicesOrderEntity } from './entities/services-order.entity';
import { Gardener } from '../gardener/entities/gardener.entity';
import { User } from '../user/entities/user.entity';
import { ServiceProvided } from '../serviceProvided/entities/serviceProvided.entity';
import { UserResponseDto } from '../user/dto/response-user.dto';
import { AdminEntity } from '../admin/entities/admin.entity';
import { Status } from '../service-details/enum/status.enum';
import { ServiceDetail } from '../service-details/entities/service-detail.entity';
import { TokenService } from '../tokenServices/token.service';
import { MailService } from '../mail/mail.service';
import { GardenerService } from '../gardener/gardener.service';

@Injectable()
export class ServicesOrderService {
  constructor(
    @InjectRepository(ServicesOrderEntity)
    private readonly servicesOrderRepository: Repository<ServicesOrderEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Gardener)
    private readonly gardenerRepository: Repository<Gardener>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(ServiceProvided)
    private readonly serviceProvidedRepository: Repository<ServiceProvided>,

    @InjectRepository(ServiceDetail)
    private readonly serviceDetailsRepository: Repository<ServiceDetail>,

    private readonly tokenService: TokenService,

    private readonly mailService: MailService,

    private readonly gardenerService: GardenerService,
  ) { }

  async create(createServicesOrderDto: CreateServiceOrderDto): Promise<any> {
    const { date, isApproved, gardenerId, userId, serviceId } = createServicesOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const gardener = await this.gardenerRepository.findOne({ where: { id: gardenerId } });
    const Admin = await this.adminRepository.findOne({ where: { id: userId } });

    const serviceProvided = [];

    for (let i = 0; i < serviceId.length; i++) {
      const service = await this.serviceProvidedRepository.findOne({ where: { id: serviceId[i] } });
      if (!service) {
        throw new Error('Service not found');
      }
      serviceProvided.push(service);
    }

    if (!gardener) {
      throw new Error('Gardener not found');
    }

    if (!serviceProvided) {
      throw new Error('Service Provided not found');
    }

    const newOrder = this.servicesOrderRepository.create({
      date: new Date().toLocaleDateString(),
      serviceDate: date,
      isApproved,
      user: user || Admin,
      gardener,
      serviceProvided,
    });

    await this.servicesOrderRepository.save(newOrder);

    const savedOrder = await this.servicesOrderRepository.findOne({
      where: { id: newOrder.id },
      relations: ['user', 'gardener', 'serviceProvided'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImageUrl: true,
        },
        gardener: {
          id: true,
          name: true,
          username: true,
          email: true,
          age: true,
          phone: true,
          profileImageUrl: true,
          experience: true,
          calification: true,
          ubication: true,
        },
        serviceProvided: {
          id: true,
          detailService: true,
          categories: true,
          price: true,
        },
      },
    });

    if (savedOrder) {
      const userResponse = new UserResponseDto(savedOrder.user);

      const response = {
        ...savedOrder,
        user: userResponse,
      };

      // Enviar el correo de confirmación
      await this.mailService.sendOrderConfirmationEmail(
        savedOrder.user.email,
        savedOrder.user.name,
        savedOrder,
      );

      return response;
    }

    throw new Error('Order not found after saving');
  }

  async findAll(page: number, limit: number): Promise<{ data: ServicesOrderEntity[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.servicesOrderRepository.findAndCount({
      take: limit,
      skip: skip,
    });

    if (count === 0) {
      throw new NotFoundException('No hay órdenes de servicio almacenadas');
    }
    return { count, data };
  }

  async findOne(id: string): Promise<ServicesOrderEntity> {
    const order = await this.servicesOrderRepository.findOne({
      where: { id },
      relations: ['user', 'gardener', 'serviceProvided', 'orderDetail'],
    })
    if (!order) {
      throw new NotFoundException(`Orden de servicio con id ${id} no encontrada`);
    }
    return order;
  }

  async obtenerFechaSiguiente(fechaInicial: string): Promise<string> {
    const [año, mes, dia] = fechaInicial.split('-').map(Number);
    const fecha = new Date(año, mes - 1, dia);
    fecha.setDate(fecha.getDate() + 1);
    const diaFinal = fecha.getDate().toString().padStart(2, '0');
    const mesFinal = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const añoFinal = fecha.getFullYear();

    return `${añoFinal}-${mesFinal}-${diaFinal}`;
  }

  async orderPay(id: string) {
    try {
      // Buscar la orden
      const order = await this.findOne(id);
      if (!order) throw new NotFoundException(`Orden de servicio con id ${id} no encontrada`);
  
      if (order.orderDetail) throw new BadRequestException('La orden de servicio ya fue pagada');
  
      order.isApproved = true;
  
      let price = 0;
      order.serviceProvided.map((service) => price += service.price);
  
      const newOrderDetail = await this.serviceDetailsRepository.create({
        serviceType: order.serviceProvided.map((service) => service.detailService),
        totalPrice: price,
        startTime: order.serviceDate,
        endTime: await this.obtenerFechaSiguiente(order.serviceDate),
        status: Status.Pending,
        servicesOrder: order,
        assignedGardener: order.gardener
      });
  
      newOrderDetail.userToken = await this.tokenService.generateToken(6);
  
      await this.serviceDetailsRepository.save(newOrderDetail);
  
      order.orderDetail = newOrderDetail;
      await this.servicesOrderRepository.save(order);
  
      const { assignedGardener, servicesOrder, ...rest } = newOrderDetail;
      const { orderDetail, user, gardener, serviceProvided, ...ord } = order;
      const { password, ...userWithoutPassword } = user;
  
      await this.mailService.sendPaymentConfirmationEmail(user.email, user.username, order);
  
      return {
        message: 'Detalle de servicio generado exitosamente',
        data: {
          order: ord,
          detail: rest,
          user: userWithoutPassword,
          gardener,
        }
      };
  
    } catch (error) {
      // Manejo de errores
      throw new HttpException(error, 400);
    }
  }
  

  async findAllByGardener(id: string) {
    const orders = await this.servicesOrderRepository.find({
      where: { gardener: { id } },
      relations: ['user', 'gardener', 'serviceProvided', 'orderDetail','reviews'],
      order: {
        serviceDate: 'ASC',
      },
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImageUrl: true,
          address: true
        },
        gardener: {
          id: true,
          name: true,
          username: true,
          email: true,
          age: true,
          phone: true,
          profileImageUrl: true,
          experience: true,
          calification: true,
          ubication: true,
        },
        serviceProvided: {
          id: true,
          detailService: true,
          categories: true,
          price: true
        },
        orderDetail: {
          id: true,
          serviceType: true,
          totalPrice: true,
          startTime: true,
          endTime: true,
          status: true,
          rating: true
        }
      }
    })
    return orders
  }

  async update(id: string, updateServiceOrderDto: UpdateServicesOrderDto): Promise<ServicesOrderEntity> {
    const order = await this.servicesOrderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Orden de servicio con id ${id} no encontrada`);
    }
    await this.servicesOrderRepository.update(id, updateServiceOrderDto);
    return this.servicesOrderRepository.findOneBy({ id });
  }

  async remove(orderId: string): Promise<void> {
    const order = await this.servicesOrderRepository.findOne({
      where: { id: orderId },
      relations: ['gardener', 'user'],
    });
  
    if (!order) {
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
  
    if (!order.gardener || !order.gardener.id) {
      throw new BadRequestException('La orden no tiene un jardinero asociado');
    }
  
    if (!order.user || !order.user.email) {
      throw new BadRequestException('La orden no tiene un usuario asociado');
    }
  
    const gardenerId = order.gardener.id;
    const reservedDay = order.serviceDate;
  
    if (!reservedDay) {
      throw new BadRequestException('No se ha especificado un día reservado para esta orden');
    }
  
    try {
      console.log(`Cancelando la reserva para jardinero ID: ${gardenerId} en el día ${reservedDay}`);
      await this.gardenerService.cancelReservation(gardenerId, reservedDay);
  
      console.log(`Enviando correo de cancelación al usuario: ${order.user.email}`);
      await this.mailService.sendOrderCancellationEmail(order.user.email, order.user.name, order);
  
      console.log(`Eliminando la orden con ID: ${orderId}`);
      await this.servicesOrderRepository.remove(order);
    } catch (error) {
      console.error('Error durante la eliminación de la orden:', error);
      throw new HttpException(
        'Error interno al procesar la eliminación de la orden',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
    
}
