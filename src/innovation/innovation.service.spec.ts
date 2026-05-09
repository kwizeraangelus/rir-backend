import { Test, TestingModule } from '@nestjs/testing';
import { InnovationService } from './innovation.service';

describe('InnovationService', () => {
  let service: InnovationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InnovationService],
    }).compile();

    service = module.get<InnovationService>(InnovationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
