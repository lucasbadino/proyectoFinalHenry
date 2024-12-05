import { Test, TestingModule } from '@nestjs/testing';
import { GardenerController } from '../gardener.controller';
import { GardenerService } from '../gardener.service';

describe('GardenerController', () => {
  let controller: GardenerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GardenerController],
      providers: [GardenerService],
    }).compile();

    controller = module.get<GardenerController>(GardenerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
