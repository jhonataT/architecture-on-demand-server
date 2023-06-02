import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { WorkRequestsService } from '../services/work-requests.service';
import { CreateWorkRequestDto } from '../dto/create-work-request.dto';
import { UpdateWorkRequestDto } from '../dto/update-work-request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('work-requests')
export class WorkRequestsController {
  constructor(private readonly workRequestsService: WorkRequestsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createWorkRequestDto: CreateWorkRequestDto): Promise<CreateWorkRequestDto> {
    try {
      return await this.workRequestsService.create(createWorkRequestDto);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/client/:clientId')
  @UseGuards(AuthGuard('jwt'))
  async findAllByClient(@Param('clientId') clientId: string): Promise<CreateWorkRequestDto[]> {
    try {
      return await this.workRequestsService.findAllByClient(clientId);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/architect/:architectId')
  @UseGuards(AuthGuard('jwt'))
  async findAllByArchitect(
    @Param('architectId') architectId: string,
    @Req() request: Request
  ): Promise<CreateWorkRequestDto[]> {
    try {
      return await this.workRequestsService.findAllByArchitect(architectId, request);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }


  @Get(':workId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('workId') workId: string): Promise<CreateWorkRequestDto> {
    try {
      return await this.workRequestsService.findOne(workId);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/deleted/:architectId')
  @UseGuards(AuthGuard('jwt'))
  async findAllDeleted(@Param('architectId') architectId: string): Promise<CreateWorkRequestDto[]> {
    try {
      return await this.workRequestsService.findAllDeleted(architectId);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':workId')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('workId') workId: string, @Body() updateWorkRequestDto: UpdateWorkRequestDto): Promise<CreateWorkRequestDto> {
    try {
      return this.workRequestsService.update(workId, updateWorkRequestDto);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':workId')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('workId') workId: string): Promise<void> {
    try {
      return this.workRequestsService.remove(workId);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }
}
