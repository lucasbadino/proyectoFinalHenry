import { Gardener } from 'src/modules/gardener/entities/gardener.entity';
import { ServicesOrderEntity } from 'src/modules/services-order/entities/services-order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Status } from '../enum/status.enum';

@Entity({
  name: 'serviceDetails',
})
export class ServiceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'simple-array' })
  serviceType: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  startTime: string;

  @Column({ type: 'text', nullable: true })
  endTime: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null
  })
  userToken: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null
  })
  gardenerToken: string;


  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending
  })
  status: string;

  @Column({ type: 'int', nullable: true })
  rating: number; // Calificación entre 0 y 5

  @OneToOne(() => ServicesOrderEntity, (servicesOrder) => servicesOrder.orderDetail, { onDelete: 'CASCADE' })
  @JoinColumn()
  servicesOrder: ServicesOrderEntity;

  @ManyToOne(() => Gardener, (gardener) => gardener.serviceDetails,
    {
      nullable: false,
      onDelete: 'CASCADE'
    },

  )
  @JoinColumn()
  assignedGardener: Gardener;


}
