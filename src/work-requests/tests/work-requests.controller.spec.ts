import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from "@nestjs/testing";
import { WorkRequestsController } from "../controllers/work-requests.controller";
import { WorkRequestsService } from "../services/work-requests.service";
import { User } from "../../users/entities/user.entity";
import { WorkRequested } from "../entities/work-requested.entity";
import { CreateWorkRequestDto } from "../dto/create-work-request.dto";
import { Request } from "express";
import { UpdateWorkRequestDto } from '../dto/update-work-request.dto';

const userEntityMock = [
    new User({ id: '05a3eb02-0024-11ee-be56-0242ac120002', email: 'user1@gmail.com', fullname: 'user 1', role: 'ARCHITECT', isActive: true }),
    new User({ id: '05a3eb02-0024-11ee-r32356-0242ac120002', email: 'user2@gmail.com', fullname: 'user 2', role: 'CLIENT', isActive: true }),
];

const workRequestsEntityList: WorkRequested[]  = [
    new WorkRequested({ id: '05a3eb02-0024-11ee-be56-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Accepted' }),
    new WorkRequested({ id: '05a3eb02-0024-11ee-2334-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Refused' }),
    new WorkRequested({ id: '05a3eb02-0024-11ee-duayhu-0242ac120002', architect: userEntityMock[0], client: userEntityMock[1], description: 'service description', status: 'Waiting' }),
];

describe('WorkRequestsController', () => {
    let workRequestsController: WorkRequestsController; 
    let workRequestsService: WorkRequestsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkRequestsController],
            providers: [
                {
                    provide: WorkRequestsService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(workRequestsEntityList[0]),
                        findAllByClient: jest.fn().mockResolvedValue(workRequestsEntityList),
                        findAllByArchitect: jest.fn().mockResolvedValue(workRequestsEntityList),
                        findOne: jest.fn().mockResolvedValue(workRequestsEntityList[0]),
                        findAllDeleted: jest.fn().mockResolvedValue(workRequestsEntityList),
                        update: jest.fn().mockResolvedValue(workRequestsEntityList[0]),
                        remove: jest.fn().mockResolvedValue(undefined).mockResolvedValue(undefined),
                    }
                }
            ] 
        }).compile();

        workRequestsController = module.get<WorkRequestsController>(WorkRequestsController);
        workRequestsService = module.get<WorkRequestsService>(WorkRequestsService);
    });

    it('Should be defined', () => {
        expect(workRequestsController).toBeDefined();
        expect(workRequestsService).toBeDefined();
    });

    describe('create', () => {
        it('Should create a new work request entity successfully.', async () => {
            // Arrange
            const workToSave: CreateWorkRequestDto = {
                architect: userEntityMock[0],
                client: userEntityMock[1],
                description: 'service description',
                status: 'Accepted'
            }
    
            // Act
            const result = await workRequestsController.create(workToSave);
    
            // Assert
            expect(result).toEqual(workRequestsEntityList[0])
            expect(workRequestsService.create).toHaveBeenCalledTimes(1);
            expect(workRequestsService.create).toHaveBeenCalledWith(workToSave);
        });

        it('Should throw an exception', () => {
            // Arange
            const workToSave: CreateWorkRequestDto = {
                architect: userEntityMock[0],
                client: userEntityMock[1],
                description: 'service description',
                status: 'Accepted'
            };

            jest.spyOn(workRequestsService, 'create').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsController.create(workToSave)).rejects.toThrowError();
        });
    });

    describe('findAllByClient', () => {
        it('Should return a work entity list filtered by client id.' , async () => {
            // Act
            const result = await workRequestsService.findAllByClient(userEntityMock[1].id);

            // Assert
            expect(result).toEqual(workRequestsEntityList);
            expect(workRequestsService.findAllByClient).toHaveBeenCalledTimes(1);
        });

        it('Should throw an exception', () => {
            // Arrange
            jest.spyOn(workRequestsService, 'findAllByClient').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsService.findAllByClient(userEntityMock[1].id))
                .rejects.toThrowError();
            expect(workRequestsService.findAllByClient).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAllByArchitect', () => {
        it('Should return a work entity list filtered by architect id.' , async () => {
            // Act
            const result = await workRequestsService.findAllByClient(userEntityMock[0].id);

            // Assert
            expect(result).toEqual(workRequestsEntityList);
            expect(workRequestsService.findAllByClient).toHaveBeenCalledTimes(1);
        });

        it('Should throw an exception', () => {
            // Arrange
            jest.spyOn(workRequestsService, 'findAllByArchitect').mockRejectedValueOnce(new Error());
            const mockRequest = {} as Request;

            // Assert
            expect(workRequestsService.findAllByArchitect(userEntityMock[0].id, mockRequest))
                .rejects.toThrowError();
            expect(workRequestsService.findAllByArchitect).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('Should return one work request entity filtered by id', async () => {
            // Act
            const result = await workRequestsController.findOne(workRequestsEntityList[0].id);

            // Assert
            await expect(result).toEqual(workRequestsEntityList[0]);
            expect(workRequestsService.findOne).toHaveBeenCalledTimes(1);
        });

        it('Should throw a not found exception.', async () => {
            // Act
            jest.spyOn(workRequestsService, 'findOne').mockRejectedValueOnce(new Error());

            // Assert
            await expect(workRequestsController.findOne(workRequestsEntityList[0].id))
                .rejects.toThrow(InternalServerErrorException)
        })
    });

    describe('findAllDeleted', () => {
        it('Should return a deleted work entity list, filtered by architect id', async () => {
            // Act
            const result = await workRequestsController.findAllDeleted(userEntityMock[0].id);

            // Assert
            expect(result).toEqual(workRequestsEntityList);
            expect(workRequestsService.findAllDeleted).toHaveBeenCalledTimes(1);
        });

        it('Should throw a not found exception', async () => {
            // Act
            jest.spyOn(workRequestsService, 'findAllDeleted').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsController.findAllDeleted(userEntityMock[0].id))
                .rejects.toThrowError(InternalServerErrorException);

            expect(workRequestsService.findAllDeleted).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('Should update an user entity.', async () => {
            // Arrange
            const toUpdateWorkRequest: UpdateWorkRequestDto = { description: 'new description' };

            // Act
            const result = await workRequestsController.update(workRequestsEntityList[0].id, toUpdateWorkRequest);
            
            // Assert
            expect(result).toEqual(workRequestsEntityList[0]);
            expect(workRequestsService.update).toHaveBeenCalledTimes(1);
        });

        it('Should throw an error occurs during update.', async () => {
            // Arrange
            const toUpdateWorkRequest: UpdateWorkRequestDto = { description: 'new description' };

            // Act
            jest.spyOn(workRequestsService, 'update').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsController.update(workRequestsEntityList[0].id, toUpdateWorkRequest))
                .rejects.toThrowError();

            expect(workRequestsService.update).toHaveBeenCalledTimes(1);
        })
    });

    describe('delete', () => {
        it('Should delete a work request entity successfully.', async () => {
            // Act
            const result = await workRequestsController.remove(workRequestsEntityList[0].id);

            // Assert
            expect(result).toBeUndefined();
            expect(workRequestsService.remove).toHaveBeenCalledTimes(1);
        });

        it('Should throw an error occurs during delete', () => {
            // Arrange
            jest.spyOn(workRequestsService, 'remove').mockRejectedValueOnce(new Error());

            // Assert
            expect(workRequestsController.remove(workRequestsEntityList[0].id))
                .rejects.toThrowError();

            expect(workRequestsService.remove).toHaveBeenCalledTimes(1);
        });
    });
});