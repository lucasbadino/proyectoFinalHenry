import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewsEntity } from "./entities/reviews.entity";
import { Repository } from "typeorm";
import { ServicesOrderEntity } from "../services-order/entities/services-order.entity";
import { Gardener } from "../gardener/entities/gardener.entity";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(ReviewsEntity)
        private readonly reviewsRepository: Repository<ReviewsEntity>,
        @InjectRepository(ServicesOrderEntity)
        private readonly servicesOrderRepository: Repository<ServicesOrderEntity>,
        @InjectRepository(Gardener)
        private readonly gardenerRepository: Repository<Gardener>,

    ) { }
    async createReview(id: string, body: any) {
        console.log(body);

        try {
            const order = await this.servicesOrderRepository.findOne({
                where: { id },
                relations: ['user', 'gardener', 'serviceProvided', 'orderDetail', 'reviews'],
            })
            if (order.reviews) {
                throw new HttpException('Order already has a review', HttpStatus.BAD_REQUEST)
            }
            if (!order) {
                throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
            }
            const gardener = await this.gardenerRepository.findOne({
                where: { id: order.gardener.id },
                relations: ['reviews']
            })
            console.log(gardener), 'gardener';


            const review = await this.reviewsRepository.create({
                comment: body.comentario,
                rate: Number(body.calificacion),
                date: new Date().toLocaleDateString(),
                gardener,
                serviceOrder: order,
            })
            order.reviews = review
            gardener.reviews.push(review)
            console.log(gardener), 'gardener';
            let suma = gardener.calification || 0
            gardener.reviews.forEach(r => suma += r.rate)
            const promedio = suma / (gardener.reviews.length + 1) // solamente el +1 para el seed
            gardener.calification = Math.floor(promedio)
            const newReview = await this.reviewsRepository.save(review)
            await this.servicesOrderRepository.save(order)
            await this.gardenerRepository.save(gardener)

            return {
                message: 'Review created successfully',
                review: newReview
            }

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }


    // Método para obtener las reseñas de un jardinero específico
    async getReviewsByGardener(gardenerId: string) {
        try {
            const reviews = await this.reviewsRepository.find({
                where: { gardener: { id: gardenerId } },
                relations: ['gardener', 'serviceOrder'],
                order: { date: 'ASC' },
            });
            return reviews;
        } catch (error) {
            throw new HttpException('Error fetching reviews', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}

