
import { AdminEntity } from "src/modules/admin/entities/admin.entity";
import { adminMock } from "./admin.mock";
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AdminSeeder {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepository: Repository<AdminEntity>,
    ) { }

    async seed() {
        const existingAdminEmail = (await this.adminRepository.find()).map(
            (admin) => admin.email,
        );
        for (const adminData of adminMock) {
            if (!existingAdminEmail.includes(adminData.email)) {
                const admin = new AdminEntity();
                admin.name = adminData.name;
                admin.email = adminData.email;
                admin.username = adminData.username;
                admin.password = await bcrypt.hash(adminData.password, 10);
                admin.phone = adminData.phone;
                admin.age = adminData.age;
                admin.role = adminData.role;
                admin.address = adminData.address;
                await this.adminRepository.save(admin);
            }
        }
    }
}