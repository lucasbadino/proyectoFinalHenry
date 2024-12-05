import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Res
} from '@nestjs/common';
import { ServicesOrderService } from './services-order.service';
import { CreateServiceOrderDto } from './dto/create-services-order.dto';
import { UpdateServicesOrderDto } from './dto/update-services-order.dto';
import { Role } from '../user/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles/role.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';


@ApiTags('serviceOrder')
@ApiBearerAuth()
@Controller('services-order')
export class ServicesOrderController {
  constructor(private readonly servicesOrderService: ServicesOrderService,

  ) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post()
  create(@Body() createServicesOrderDto: CreateServiceOrderDto, @Res() res: Response) {
    try {
      const serviceOrder = this.servicesOrderService.create(createServicesOrderDto);
      return res.status(201).json(serviceOrder);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.servicesOrderService.findAll(page, limit);
  }

  @UseGuards(AuthGuard)
  @Get('orderPay/:id')
  async orderPay(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.servicesOrderService.orderPay(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const serviceOrder = await this.servicesOrderService.findOne(id);

    if (!serviceOrder) {
      throw new HttpException("Orden de servicio no encontrada", HttpStatus.NOT_FOUND);
    }

    return serviceOrder;
  }
  
  @UseGuards(AuthGuard)
  @Get('gardener/:id')
  async findAllByGardener(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      const serviceOrder = await this.servicesOrderService.findAllByGardener(id);
      return res.status(200).json(serviceOrder);
    } catch (error) {
      throw new HttpException("Orden de servicio no encontrada", HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServicesOrderDto: UpdateServicesOrderDto,
  ) {
    return this.servicesOrderService.update(id, updateServicesOrderDto);
  }

  @Delete(':orderId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async deleteOrder(@Param('orderId', ParseUUIDPipe) orderId: string, @Res() res: Response) {
    try {
      console.log(`Intentando eliminar la orden con ID: ${orderId}`);
      await this.servicesOrderService.remove(orderId);
      return res.status(200).json({ message: 'Orden eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar la orden:', error);

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return res.status(500).json({ message: 'Error interno al eliminar la orden', error: errorMessage });
    }
  }


}
