import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { ServicesOrderEntity } from 'src/modules/services-order/entities/services-order.entity';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  age: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  role: Role;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true
  })
  isGoogle: boolean

  @OneToMany(() => ServicesOrderEntity,
    (serviceOrders) => serviceOrders.user,
    {
      onDelete: 'CASCADE',
    })
  servicesOrder: ServicesOrderEntity[];

  @Column({ type: 'text', nullable: true })
  profileImageUrl: string;

}
