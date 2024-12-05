import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Res } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Response } from "express";

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService
    ) { }

    // Ruta POST para crear una reseña (ya la tienes)
    @Post('create/:id')
    async createReview(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: any, @Res() res: Response) {
        try {
            const review = await this.reviewsService.createReview(id, body);
            return res.status(200).send(review);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

  

      // Ruta para obtener las reseñas de un jardinero específico
      @Get('gardener/:id')
      async getReviewsByGardener(@Param('id', new ParseUUIDPipe()) id: string) {
          try {
              const reviews = await this.reviewsService.getReviewsByGardener(id);
              return reviews;
          } catch (error) {
              throw error;
          }
      }
}
