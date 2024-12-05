import { Gardener } from 'src/modules/gardener/entities/gardener.entity';
import { ServicesOrderEntity } from 'src/modules/services-order/entities/services-order.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Categories } from '../enums/categories.enum';

@Entity({
  name: 'ServiceProvided',
})
export class ServiceProvided {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  detailService: string;

  @Column()
  price: number;

  @Column("text", {array:true})
  categories: Categories[];

  @ManyToMany(() => Gardener, (gardener) => gardener.serviceProvided, {
    onDelete: 'CASCADE',
  })
  @JoinTable() 
  gardener: Gardener[];

  // @OneToMany(() => User, (user) => user.serviceProvided, { onDelete: "CASCADE" })
  // user: User

  @ManyToMany(
    () => ServicesOrderEntity,
    (serviceOrder) => serviceOrder.serviceProvided,
    { onDelete: 'CASCADE' },
  )
  serviceOrder: ServicesOrderEntity[];
}
