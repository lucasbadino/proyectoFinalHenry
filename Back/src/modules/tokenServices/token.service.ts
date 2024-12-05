import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { ServicesOrderEntity } from "../services-order/entities/services-order.entity";
import { Repository } from "typeorm";
import { Status } from "../service-details/enum/status.enum";
import { ServiceDetail } from "../service-details/entities/service-detail.entity";


@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(ServicesOrderEntity)
        private readonly orderService: Repository<ServicesOrderEntity>,
        @InjectRepository(ServiceDetail)
        private readonly serviceDetail: Repository<ServiceDetail>,
    ) { }
    async generateToken(num: number = 6): Promise<string> {
        return await nanoid(num);
    }

    async checkToken(body, id: string) {
        const order = await this.orderService.findOne(
            {
                where: { id },
                relations: ['orderDetail'],
            },
        );
        console.log(order);
        if (!order) throw new HttpException('No se encontro la orden de servicio', 404);
        if (order.orderDetail.userToken !== body.token) throw new HttpException('El token es incorrecto', 401);
        const detail = await this.serviceDetail.findOneBy({ id: order.orderDetail.id });
        detail.status = Status.Finished;
        detail.gardenerToken = body.token;
        await this.serviceDetail.save(detail);
        return {
            message: 'El token es correcto',
            status: 200,
            body
        };

    }

}