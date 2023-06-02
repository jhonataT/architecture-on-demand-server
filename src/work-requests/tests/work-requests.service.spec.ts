import { User } from "src/users/entities/user.entity";
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { WorkRequested } from "../entities/work-requested.entity";
import { Repository } from "typeorm";
import { WorkRequestsService } from "../services/work-requests.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateWorkRequestDto } from "../dto/create-work-request.dto";
import { Request } from "express";
import { UpdateWorkRequestDto } from "../dto/update-work-request.dto";

const userEntityMock = [
    new User({ id: '05a3eb02-0024-11ee-be56-0242ac120002', email: 'user1@gmail.com', fullname: 'user 1', role: 'ARCHITECT', isActive: true }),
    new User({ id: '05a3eb02-0024-11ee-r32356-0242ac120002', email: 'user2@gmail.com', fullname: 'user 2', role: 'CLIENT', isActive: true }),
];

const workRequestsEntityList: WorkRequested[]  = [
    new WorkRequested({ id: '05a3eb02-0024-11ee-be56-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Accepted' }),
    new WorkRequested({ id: '05a3eb02-0024-11ee-2334-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Refused' }),
    new WorkRequested({ id: '05a3eb02-0024-11ee-duayhu-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Waiting' }),
];

const mockWorkRequestsRepository = () => ({
    create: jest.fn().mockReturnValue(workRequestsEntityList[0]),
    save: jest.fn().mockResolvedValue(workRequestsEntityList[0]),
    find: jest.fn().mockResolvedValue(workRequestsEntityList),
    findOne: jest.fn().mockResolvedValue(workRequestsEntityList[0]),
    update: jest.fn(),
    softDelete: jest.fn(),
});

describe('WorkRequestsService', () => {
    let workRequestsService: WorkRequestsService;
    let workRequestsRepository: Repository<WorkRequested>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkRequestsService,
                { provide: getRepositoryToken(WorkRequested), useFactory: mockWorkRequestsRepository }
            ]
        }).compile();

        workRequestsService = module.get<WorkRequestsService>(WorkRequestsService);
        workRequestsRepository = module.get<Repository<WorkRequested>>(getRepositoryToken(WorkRequested));
    });

    it('Should be defined', () => {
        expect(workRequestsService).toBeDefined();
        expect(workRequestsRepository).toBeDefined();
    });

    describe('create', () => {
        it('Should create a new work request entity', async () => {
            // Arrange
            const workToSave: CreateWorkRequestDto = {
                architect: userEntityMock[0],
                client: userEntityMock[1],
                description: 'service description',
                status: 'Accepted'
            };

            // Act
            const result = await workRequestsService.create(workToSave);

            // Assert
            expect(result).toEqual(workRequestsEntityList[0]);
            expect(workRequestsRepository.create).toHaveBeenCalledTimes(1);
            expect(workRequestsRepository.save).toHaveBeenCalledTimes(1);
        });
        
        it('Should throw an exception', () => {
            // Arrange
            const workToSave: CreateWorkRequestDto = {
                architect: userEntityMock[0],
                client: userEntityMock[1],
                description: 'service description',
                status: 'Accepted'
            };

            // Act
            jest.spyOn(workRequestsRepository, 'save').mockRejectedValueOnce(new Error());
            
            // Assert
            expect(workRequestsService.create(workToSave))
                .rejects.toThrowError()

            expect(workRequestsRepository.create).toHaveBeenCalledTimes(1);
            expect(workRequestsRepository.save).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('Should return one work request entity successfully', async () => {
            // Act
            const result = await workRequestsService.findOne(workRequestsEntityList[0].id);

            // Assert
            expect(result).toEqual(workRequestsEntityList[0]);
            expect(workRequestsRepository.findOne).toHaveBeenCalledTimes(1);
        });

        it('Should throw a not found exception', () => {
            // Act
            jest.spyOn(workRequestsRepository, 'findOne').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.findOne(workRequestsEntityList[0].id))
                .rejects.toThrowError();
            expect(workRequestsRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAllByArchitect', () => {
        it('Should return a work request entity list successfully', async () => {
            // Arrange
            const mockRequest = {} as Request;
            
            // Act
            const result = await workRequestsService.findAllByArchitect(userEntityMock[0].id, mockRequest);

            // Assert
            expect(result).toEqual(workRequestsEntityList);
            expect(workRequestsRepository.find).toHaveBeenCalledTimes(1);
        });

        it('Should throw a not found exception', () => {
            // Arrange
            const mockRequest = {} as Request;

            // Act
            jest.spyOn(workRequestsRepository, 'find').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.findAllByArchitect(userEntityMock[0].id, mockRequest))
                .rejects.toThrowError(NotFoundException);
        });
    });

    describe('findAllByClient', () => {
        it('Should return a work request entity list successfully', async () => {
            // Act
            const result = await workRequestsService.findAllByClient(userEntityMock[1].id);

            // Assert
            expect(result).toEqual(workRequestsEntityList);
            expect(workRequestsRepository.find).toHaveBeenCalledTimes(1);
        });

        it('Should throw a not found exception', () => {
            // Act
            jest.spyOn(workRequestsRepository, 'find').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.findAllByClient(userEntityMock[1].id))
                .rejects.toThrowError(NotFoundException);
        });
    });

    describe('update', () => {
        it('Should update a work resquest entity item successfully', async () => {
            // Arrange
            const toUpdateWorkRequest: UpdateWorkRequestDto = { description: 'new description' };

            // Act
            const result = await workRequestsService.update(workRequestsEntityList[0].id, toUpdateWorkRequest);

            // Assert
            expect(result).toEqual(workRequestsEntityList[0]);
            expect(workRequestsRepository.update).toHaveBeenCalledTimes(1);
        });

        it('Should throw a exception', () => {
            // Arrange
            const toUpdateWorkRequest: UpdateWorkRequestDto = { description: 'new description' };

            // Act
            jest.spyOn(workRequestsRepository, 'update').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.update(workRequestsEntityList[0].id, toUpdateWorkRequest))
                .rejects.toThrowError(ForbiddenException);
            expect(workRequestsRepository.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('Should delete a work request entity successfully.', async () => {
            // Act
            const result = await workRequestsService.remove(workRequestsEntityList[0].id);

            // Assert
            expect(result).toBeUndefined();
            expect(workRequestsRepository.softDelete).toHaveBeenCalledTimes(1);
        });

        it('Should throw a ForbiddenException if an error occurs during delete', async () => {
            // Act
            jest.spyOn(workRequestsRepository, 'softDelete').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.remove(workRequestsEntityList[0].id))
                .rejects.toThrowError(ForbiddenException);
            expect(workRequestsRepository.softDelete).toHaveBeenCalledTimes(1);
        });
    });
});