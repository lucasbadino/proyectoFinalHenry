import { HttpException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesOrderEntity } from '../services-order/entities/services-order.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MercadoPagoService {
    constructor(
        @InjectRepository(ServicesOrderEntity)
        private readonly orderService: Repository<ServicesOrderEntity>,
    ) { }
    async createPayment(id: string) {
        const order = await this.orderService.findOne(
            {
                where: { id },
                relations: ['user', 'gardener', 'serviceProvided']
            }
        );
        let unit_price = 0;
        const title = order.serviceProvided.map((service) => service.detailService).join(', ');
        const quantity = 1;
        order.serviceProvided.map((service) => unit_price += Number(service.price));
        const user = order.user
        const client = new MercadoPagoConfig(
            {
                accessToken: 'TEST-3728560213952663-111517-c3f722e5628bac5e409e2c14d8b04de6-145773953'
            }
        );
        const preference = new Preference(client)

        try {
            const preferenceResponse = await preference.create({
                body: {
                    items: [
                        {
                            id,
                            title,
                            quantity,
                            unit_price: Number(unit_price),  // Asegúrate de convertir el precio a número
                            currency_id: 'ARS',
                        }
                    ],
                    payer: {
                        name: user.name,
                        email: user.email,
                        identification: {
                            type: 'DNI',
                            number: "12345678"
                        }
                    },
                    coupon_code: "COUPON_CODE",
                    external_reference: `${order.id}`,

                    statement_descriptor: 'Pago de servicio',
                    metadata: {
                        company_name: 'VICNASOL',  // Aquí se agrega el nombre de la empresa
                        order_id: 'order-12345',
                    },
                    auto_return: 'approved',  // Redirige automáticamente después del pago aprobado
                    back_urls: {
                        success: `${process.env.FRONT_URL}/dashboard/userDashboard`,
                        failure: `${process.env.FRONT_URL}/dashboard/userDashboard`,
                        pending: `${process.env.FRONT_URL}/dashboard/userDashboard`,
                    },
                }
            });
            const paymentUrl = preferenceResponse;
            return { paymentUrl };

        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
}