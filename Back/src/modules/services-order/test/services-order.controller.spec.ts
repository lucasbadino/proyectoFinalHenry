import { Test, TestingModule } from '@nestjs/testing';
import { ServicesOrderController } from '../services-order.controller';
import { ServicesOrderService } from '../services-order.service';

describe('ServicesOrderController', () => {
  let controller: ServicesOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesOrderController],
      providers: [ServicesOrderService],
    }).compile();

    controller = module.get<ServicesOrderController>(ServicesOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
