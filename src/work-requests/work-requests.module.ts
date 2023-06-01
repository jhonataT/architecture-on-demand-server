import { Module } from '@nestjs/common';
import { WorkRequestsService } from './services/work-requests.service';
import { WorkRequestsController } from './controllers/work-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkRequested } from './entities/work-requested.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkRequested]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [WorkRequestsController],
  providers: [WorkRequestsService],
})
export class WorkRequestsModule {}
