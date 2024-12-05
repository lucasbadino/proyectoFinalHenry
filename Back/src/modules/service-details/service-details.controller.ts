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
  HttpStatus 
} from '@nestjs/common';
import { ServiceDetailsService } from './service-details.service';
import { CreateServiceDetailDto } from './dto/create-service-detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { Role } from '../user/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles/role.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('serviceDetails')
@ApiBearerAuth()
@Controller('service-details')
export class ServiceDetailsController {
  constructor(private readonly serviceDetailsService: ServiceDetailsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createServiceDetailDto: CreateServiceDetailDto) {
    return await this.serviceDetailsService.create(createServiceDetailDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Roles(Role.Admin)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.serviceDetailsService.findAll(page, limit);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const serviceDetail = await this.serviceDetailsService.findOne(id);

    if (!serviceDetail) {
      throw new HttpException("Service Detail no encontrado.", HttpStatus.NOT_FOUND);
    }

    return serviceDetail;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDetailDto: UpdateServiceDetailDto) {
    return this.serviceDetailsService.update(id, updateServiceDetailDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceDetailsService.remove(id);
  }
}
