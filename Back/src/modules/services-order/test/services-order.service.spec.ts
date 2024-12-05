import { Test, TestingModule } from '@nestjs/testing';
import { ServicesOrderService } from '../services-order.service';

describe('ServicesOrderService', () => {
  let service: ServicesOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicesOrderService],
    }).compile();

    service = module.get<ServicesOrderService>(ServicesOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
