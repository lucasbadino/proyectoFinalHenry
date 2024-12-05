import { PartialType } from '@nestjs/swagger';
import { CreateServiceOrderDto } from './create-services-order.dto';

export class UpdateServicesOrderDto extends PartialType(CreateServiceOrderDto) {}
