import { Gardener } from "src/modules/gardener/entities/gardener.entity";
import { ServicesOrderEntity } from "src/modules/services-order/entities/services-order.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
@Entity()
export class ReviewsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()

    @Column(
        {
            type: "text",
            nullable: true,
        }
    )
    date: string

    @Column()
    comment: string

    @Column()
    rate: number

    @ManyToMany(() => Gardener, (gardener) => gardener.reviews,{ onDelete: "CASCADE" })
    @JoinTable()
    gardener: Gardener

    @OneToOne(() => ServicesOrderEntity, (serviceOrder) => serviceOrder.reviews)
    serviceOrder: ServicesOrderEntity
}