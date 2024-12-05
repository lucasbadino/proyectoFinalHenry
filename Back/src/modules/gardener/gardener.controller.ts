import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { GardenerService } from './gardener.service';
import { CreateGardenerDto } from './dto/create-gardener.dto';
import { UpdateGardenerDto } from './dto/update-gardener.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadPipe } from 'src/pipes/image-upload/image-upload.pipe';
import { UploadFileDto } from 'src/file-upload/dtos/uploadFile.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { Role } from '../user/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles/role.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Gardener } from './entities/gardener.entity';
import { Response } from 'express';


@ApiTags('gardener')
@ApiBearerAuth()
@Controller('gardener')
export class GardenerController {
  constructor(
    private readonly gardenerService: GardenerService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  @Post(':gardenerId/reserve')
  @UseGuards(AuthGuard)
  async reserveDay(
    @Param('gardenerId', new ParseUUIDPipe()) gardenerId: string,
    @Body() day: any,
    @Res() res: Response
  ) {
    try {
      if (!day?.date) return res.status(400).json({ message: 'El campo "date" es requerido' });

      if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return res.status(400).json({ message: 'El campo "date" debe estar en formato YYYY-MM-DD' });
      const response = await this.gardenerService.reserveDay(gardenerId, day);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno', error });
    }
  }

  @Get(':gardenerId/reservedDays')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getReservedDays(
    @Param('gardenerId', new ParseUUIDPipe()) gardenerId: string,
    @Res() res: Response
  ) {
    try {
      console.log(`Solicitud recibida para el jardinero: ${gardenerId}`);
      const reservedDays = await this.gardenerService.getReservedDays(gardenerId);
      return res.status(200).json(reservedDays ? reservedDays : []);

    } catch (error) {
      return res.status(500).json({ message: 'Error interno', error });
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createGardenerDto: CreateGardenerDto, @Res() res: Response) {
    try {
      const newGardener = this.gardenerService.create(createGardenerDto);
      return res.status(201).json(newGardener);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numero de pagina',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de items por pagina',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filtrar por nombre de Jardinero',
  })
  @ApiQuery({
    name: 'calification',
    required: false,
    type: Number,
    description: 'Filter por Calificacion',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Ordenar por (ASC or DESC)',
  })
  async findAll(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('calification') calification?: number,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',

  ) {
    try {
      const data = await this.gardenerService.findAll(page, limit, name, calification, order);
      return res.status(200).json({
        data: data.data,
        totalCount: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / limit)
      });
    }  catch (error) {
      return res.status(500).json({ message: 'Error interno', error });
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary"
        }
      }
    }
  })
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile(new ImageUploadPipe()) file: Express.Multer.File,
    // @Res() res: Response
  ) {
    try {
      const uploadFileDto: UploadFileDto = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      };

      const imageUrl = await this.fileUploadService.uploadFile(
        uploadFileDto,
        'gardener',
      );
      await this.gardenerService.updateProfileImage(id, imageUrl);

      return { imageUrl };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  @UseGuards(AuthGuard)
  @Post('carrousel/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCarrouselImages(
    @Param('id') id: string,
    @UploadedFile(new ImageUploadPipe()) file: Express.Multer.File,
    @Res() res: Response
  ) {
    try {

      const uploadFileDto: UploadFileDto = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      };

      const imageUrl = await this.fileUploadService.uploadFile(
        uploadFileDto,
        'gardener',
      );
      await this.gardenerService.uploadCarrouselImages(id, imageUrl);

      return { imageUrl };
    } catch (error) {
      return res.status(500).json({ message: 'Error interno', error });
    }
  }

  @Get(':id/image')
  @HttpCode(200)
  async getProfileImage(@Param('id') id: string, @Res() res: Response) {
    try {
      const gardener = await this.gardenerService.findOne(id);
      return { imageUrl: gardener.profileImageUrl };

    } catch (error) {
      return res.status(500).json({ message: 'Error interno', error });
    }
  }

  @Get('carrousel/:id')
  @HttpCode(200)
  async getCarrouselImages(@Param('id') id: string) {
    const gardener = await this.gardenerService.findOne(id);
    return { imageUrl: gardener.carrouselImages };
  }

  @Patch("carrousel/:id")
  @HttpCode(200)
  async updateCarrouselImages(@Param('id') id: string, @Body() carrousel: string[]) {
    return this.gardenerService.updateCarrouselImages(id, carrousel);
  }

  @UseGuards(AuthGuard)
  @Get(':id/serviceProvided')
  @HttpCode(200)
  async getServiceProvided(@Param('id', new ParseUUIDPipe()) id: string) {
    const servicesOfTheGardener = await this.gardenerService.findServicesProvidedByGardener(id);

    if (!servicesOfTheGardener) {
      throw new HttpException(
        'No hay servicios prestados por este Jardinero.',
        HttpStatus.NOT_FOUND,
      );
    }
    return servicesOfTheGardener;
  }

  @UseGuards(AuthGuard)
  @Get(':id/orders')
  @HttpCode(200)
  getOrdersAsigned(@Param('id', new ParseUUIDPipe()) id: string) {
    const servicesOfTheGardener =
      this.gardenerService.findOrdersAsignedForGardener(id);

    if (!servicesOfTheGardener) {
      throw new HttpException(
        'No hay ordenes asignadas a este Jardinero.',
        HttpStatus.NOT_FOUND,
      );
    }
    return servicesOfTheGardener;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const gardener = this.gardenerService.findOne(id);

    if (!gardener) {
      throw new HttpException('Jardinero no encontrado.', HttpStatus.NOT_FOUND);
    }

    return gardener;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Gardener)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGardenerDto: UpdateGardenerDto,
  ) {
    console.log("Im here bro")
    return this.gardenerService.updateGardener(id, updateGardenerDto);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Gardener)
  @Patch('/servicesEdit/:id')
  updateGardenerServices(
    @Param('id') id: string,
    @Body() updateGardenerDto: UpdateGardenerDto,
  ) {
    console.log("Im here bro")
    return this.gardenerService.updateServices(id, updateGardenerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      const userDeleted = await this.gardenerService.remove(id);
      return res.status(200).json({ status: 200, userDeleted });

    } catch (error) {
      return res.status(500).json({ message: 'Error interno', error, status: 500 });
    }
  }

  @Get()
  async findGardenersByService(@Query('serviceId') serviceId: string): Promise<Gardener[]> {
    return this.gardenerService.findByService(serviceId);
  }
}
