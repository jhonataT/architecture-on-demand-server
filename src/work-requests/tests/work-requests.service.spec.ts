import { Test, TestingModule } from '@nestjs/testing';
import { WorkRequestsService } from '../services/work-requests.service';

describe('WorkRequestsService', () => {
  let service: WorkRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkRequestsService],
    }).compile();

    service = module.get<WorkRequestsService>(WorkRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
