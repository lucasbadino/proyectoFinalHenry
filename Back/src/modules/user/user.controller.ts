import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, UseGuards, HttpException, HttpStatus, ParseUUIDPipe, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { IsUUID } from 'class-validator';
import { ServicesOrderService } from '../services-order/services-order.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadPipe } from 'src/pipes/image-upload/image-upload.pipe';
import { UploadFileDto } from 'src/file-upload/dtos/uploadFile.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { GardenerService } from '../gardener/gardener.service';
import { Response } from 'express';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly serviceOrderService: ServicesOrderService,
    private readonly fileUploadService: FileUploadService,
    private readonly gardenerService: GardenerService,) { }

  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Roles(Role.Admin)
  @Get()
  @ApiQuery({ name: 'page', required: false, description: 'Número de página para la paginación', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', example: 10 })
  @ApiQuery({ name: 'name', required: false, description: 'Nombre para filtrar los resultados', example: '' })
  @ApiQuery({ name: 'order', required: false, description: 'Orden de los resultados (ASC o DESC)', enum: ['ASC', 'DESC'], example: 'ASC' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('isBanned') isBanned?: boolean,
    @Query('role') role?: string,
  ) {
    return this.userService.findAll(page, limit, name, order, isBanned, role);
  }

  @UseGuards(AuthGuard)
  @Get(':id/orders')
  async findOrderUser(@Param('id') id: string) {
    const user = await this.userService.findOneWithOrders(id);

    if (!user) {
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
    }

    return [user];
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {

    if (!IsUUID(4, { each: true })) {
      throw new HttpException("UUID Invalida", HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.findOne(id);

    if (!user) {
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND)
    }

    return user
  }

  @Post('google')
  async findByEmail(@Body() email: { email: string }, @Res() res: Response) {
    try {
      const result = await this.userService.googleEmail(email);
      return res.status(HttpStatus.OK).send(result);

    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).send(error);

    }
  }


  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('/gardener/:id')
  async userFindGardener(@Param('id', new ParseUUIDPipe()) id: string) {

    if (!IsUUID(4, { each: true })) {
      throw new HttpException("UUID Invalida", HttpStatus.BAD_REQUEST)
    }

    const gardener = await this.gardenerService.findOne(id);

    if (!gardener) {
      throw new HttpException("Jardinero no encontrado", HttpStatus.NOT_FOUND)
    }

    return gardener
  }

  //IMAGEN 

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
  ) {
    const uploadFileDto: UploadFileDto = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    const imageUrl = await this.fileUploadService.uploadFile(uploadFileDto, 'users');
    await this.userService.updateProfileImage(id, imageUrl);

    return { imageUrl };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/ban')
  @HttpCode(200)
  banUser(@Param('id') id: string) {
    return this.userService.banUser(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

