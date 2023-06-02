import { In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateWorkRequestDto } from '../dto/create-work-request.dto';
import { UpdateWorkRequestDto } from '../dto/update-work-request.dto';
import { WorkRequested } from './../entities/work-requested.entity';
import { Request } from 'express';

@Injectable()
export class WorkRequestsService {
  constructor(
    @InjectRepository(WorkRequested)
    private readonly workRepository: Repository<WorkRequested>
  ) {}

  async create(createWorkRequestDto: CreateWorkRequestDto): Promise<CreateWorkRequestDto> {
    try {
      const newWorkToSave = this.workRepository.create(createWorkRequestDto);
      return await this.workRepository.save(newWorkToSave);
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findAllByClient(clientId: string): Promise<CreateWorkRequestDto[]> {
    try {
      return await this.workRepository.find({
        where: { client: { id: clientId } },
        select: ['id', 'description', 'status', 'client', 'architect', 'createdAt'],
        relations: ['client', 'architect']
      }); 
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  async findAllByArchitect(architectId: string, request: Request): Promise<CreateWorkRequestDto[]> {
    try {
      const query: { status?: "Waiting" | "Accepted" | "Refused" } = request.query;
      
      return await this.workRepository.find({
        where: { architect: { id: architectId }, status: query?.status || In(["Waiting", "Accepted", "Refused"]) },
        relations: ['client', 'architect']
      }); 
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  async findOne(workId: string): Promise<CreateWorkRequestDto> {
    try {
      return await this.workRepository.findOne({
        where: { id: workId },
        relations: ['client', 'architect']
      });
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  async findAllDeleted(architectId: string): Promise<CreateWorkRequestDto[]> {
    try {
      return await this.workRepository.find({
        where: { architect: { id: architectId }, deletedAt: Not(IsNull()) },
        relations: ['client', 'architect'],
        withDeleted: true
      });
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(workId: string, updateWorkRequestDto: UpdateWorkRequestDto): Promise<CreateWorkRequestDto> {
    try {
      await this.workRepository.update({ id: workId }, updateWorkRequestDto);
      return await this.findOne(workId);
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }

  async remove(workId: string): Promise<void> {
    try {
      await this.workRepository.softDelete({ id: workId });
      return;
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }
}
