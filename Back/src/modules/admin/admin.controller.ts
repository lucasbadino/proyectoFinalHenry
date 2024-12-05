import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, ParseUUIDPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { RolesGuard } from 'src/guards/roles/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    @Get()
    async getAllAdmin(@Res() res: Response) {
        try {
            const users = await this.adminService.getAllAdmin();
            if (!users) {
                throw new HttpException(`Admin not Found`, 400);
            }
            return res.status(200).json(users);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    @UseGuards(RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    @Get(':id')
    async getAdminById(@Param('id', ParseUUIDPipe) id: string,@Res() res: Response) {
        try {
            const user = await this.adminService.getAdminById(id);
            if (!user) {
                throw new HttpException(`Admin with the ID ${id} not Found`, 400);
            }
            return res.status(200).json(user);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    @UseGuards(RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    @Post()
    async createAdmin(@Body() createAdmin,@Res() res: Response) {
        try {
            const data = await this.adminService.createAdmin(createAdmin);
            if (!data) {
                throw new HttpException(`wrong data`, 400);
            }
            return res.status(200).json(data);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    @UseGuards(RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    @Patch(':id')
    async updateAdmin(@Param('id', ParseUUIDPipe) id: string, @Body() updateAdmin,@Res() res: Response) {
        try {
            const data = await this.adminService.updateAdmin(id, updateAdmin);
            if (!data) {
                throw new HttpException(`Admin with the ID ${id} not Found`, 400);
            }
            return res.status(200).json(data);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    @UseGuards(RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    @Delete(':id')
    async removeAdmin(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
        try {
            const data = await this.adminService.removeAdmin(id);
            if (!data) {
                throw new HttpException(`Admin with the ID ${id} not Found`, 400);
            }
            return res.status(200).json(data);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
}
