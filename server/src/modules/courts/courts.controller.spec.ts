import { Test, TestingModule } from '@nestjs/testing';
import { CourtsController } from './courts.controller';
import { CourtsService } from './courts.service';

describe('CourtsController', () => {
  let controller: CourtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtsController],
      providers: [CourtsService],
    }).compile();

    controller = module.get<CourtsController>(CourtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
