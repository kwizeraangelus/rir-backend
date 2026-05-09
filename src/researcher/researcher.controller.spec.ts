import { Test, TestingModule } from '@nestjs/testing';
import { ResearcherController } from './researcher.controller';

describe('ResearcherController', () => {
  let controller: ResearcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearcherController],
    }).compile();

    controller = module.get<ResearcherController>(ResearcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
