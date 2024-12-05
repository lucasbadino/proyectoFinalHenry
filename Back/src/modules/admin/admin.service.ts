import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {

    
    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepository: Repository<AdminEntity>,
    ) { }
    async getAllAdmin() {
        try {
            return await this.adminRepository.find();

        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    async getAdminById(id: string) {
        try {
            const admin = await this.adminRepository.findOne({ where: { id } });
            return admin;
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    async findByEmail(email: string) {
        try {
            const admin = await this.adminRepository.findOne({ where: { email } });
            return admin;
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    async createAdmin(createAdmin) {
        try {
            const newAdmin = await this.adminRepository.create(createAdmin);
            return await this.adminRepository.save(newAdmin);
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    async updateAdmin(id: string, updateAdmin: any) {
        try {
            const admin = await this.adminRepository.findOne({ where: { id } });
            return await this.adminRepository.save({ ...admin, ...updateAdmin });
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    async removeAdmin(id: string) {
        try {
            const userDeleted = await this.adminRepository.delete({ id });
            if (!userDeleted) {
                throw new HttpException(`Admin with the ID ${id} not Found`, 400);
            }
            return {
                message: `Admin with the ID ${id} DELETED exitosly`,
                status: 200,
                user: userDeleted
            };
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
}
