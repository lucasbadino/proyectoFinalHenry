import { Controller, Post, Body, Get, Param, ParseUUIDPipe, HttpException, Res } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { Response } from 'express';


@Controller('mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,

  ) { }

  @Get('create-payment/:id')
  async payments(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      const payment = await this.mercadoPagoService.createPayment(id);
      return res.status(200).json(payment);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}