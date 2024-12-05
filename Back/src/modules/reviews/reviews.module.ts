


import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsEntity } from './entities/reviews.entity';
import { ServicesOrderEntity } from '../services-order/entities/services-order.entity';
import { Gardener } from '../gardener/entities/gardener.entity';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
    imports: [
        TypeOrmModule.forFeature([ReviewsEntity, ServicesOrderEntity, Gardener]),
    ],
})
export class ReviewsModule {}