import { Test, TestingModule } from '@nestjs/testing';
import { InnovationController } from './innovation.controller';

describe('InnovationController', () => {
  let controller: InnovationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InnovationController],
    }).compile();

    controller = module.get<InnovationController>(InnovationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
