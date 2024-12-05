import { ServiceDetail } from "src/modules/service-details/entities/service-detail.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "src/modules/user/entities/user.entity";
import { ServiceProvided } from "src/modules/serviceProvided/entities/serviceProvided.entity";
import { Gardener } from "src/modules/gardener/entities/gardener.entity";
import { ReviewsEntity } from "src/modules/reviews/entities/reviews.entity";

@Entity({ name: "service_order" })
export class ServicesOrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column()
    date: string;

    @Column(
        {
            type: "text",
            nullable: true,
        }
    )
    serviceDate: string;

    @Column({ default: false })
    isApproved: boolean;

    // Relación con la entidad ServiceDetail (1:1)
    @OneToOne(() => ServiceDetail, (serviceDetail) => serviceDetail.servicesOrder, { onDelete: "CASCADE" })
    @JoinColumn()
    orderDetail: ServiceDetail;
    // // Relación con la entidad ServiceDetail (1:1)
    @ManyToMany(() => ServiceProvided, (serviceProvided) => serviceProvided.serviceOrder, { onDelete: "CASCADE" })
    @JoinTable()
    serviceProvided: ServiceProvided[];

    // Relación con la entidad Gardener (Muchos a Uno)
    @ManyToOne(() => Gardener, (gardener) => gardener.servicesOrder,{ onDelete: "CASCADE" })
    @JoinColumn()
    gardener: Gardener;

    // Relación con la entidad User (Muchos a Uno)
    @ManyToOne(() => User, (user) => user.servicesOrder)
    @JoinColumn()
    user: User;

    @OneToOne(() => ReviewsEntity, (reviews) => reviews.serviceOrder)
    @JoinColumn()
    reviews: ReviewsEntity
}