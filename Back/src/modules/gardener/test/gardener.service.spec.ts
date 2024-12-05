import { Test, TestingModule } from '@nestjs/testing';
import { GardenerService } from '../gardener.service';

describe('GardenerService', () => {
  let service: GardenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GardenerService],
    }).compile();

    service = module.get<GardenerService>(GardenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
