import { Test, TestingModule } from '@nestjs/testing';
import { WorkRequestsController } from '../controllers/work-requests.controller';
import { WorkRequestsService } from '../services/work-requests.service';

describe('WorkRequestsController', () => {
  let controller: WorkRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkRequestsController],
      providers: [WorkRequestsService],
    }).compile();

    controller = module.get<WorkRequestsController>(WorkRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
