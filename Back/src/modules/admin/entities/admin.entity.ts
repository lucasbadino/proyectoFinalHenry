import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity()
export class AdminEntity extends User {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()
    @Column()
    isSuperAdmin: boolean = false
    
}