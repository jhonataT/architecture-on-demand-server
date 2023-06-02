import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './../services/users.service';
import { UsersController } from "../controllers/users.controller";
import { ReturnUserDto } from "../dto/return-user.dto";
import { User } from "../entities/user.entity";
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const userEntityList: ReturnUserDto[]  = [
    new User({ id: '05a3eb02-0024-11ee-be56-0242ac120002', email: 'user1@gmail.com', fullname: 'user 1', role: 'ARCHITECT', isActive: true }),
    new User({ id: '4d298374-0024-11ee-be56-0242ac120002', email: 'user2@gmail.com', fullname: 'user 2', role: 'CLIENT', isActive: true }),
    new User({ id: '4d2986f8-0024-11ee-be56-0242ac120002', email: 'user3@gmail.com', fullname: 'user 3', role: 'ARCHITECT', isActive: true }),
    new User({ id: '4d2988f6-0024-11ee-be56-0242ac120002', email: 'user4@gmail.com', fullname: 'user 4', role: 'CLIENT', isActive: false })
];

describe('UsersController', () => {
    let usersControllers: UsersController; 
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        findAllByType: jest.fn().mockResolvedValue(userEntityList),
                        findOne: jest.fn().mockResolvedValue(userEntityList[0]),
                        create: jest.fn().mockResolvedValue(userEntityList[0]), 
                        update: jest.fn().mockResolvedValue(userEntityList[0]),
                        softDelete: jest.fn().mockResolvedValue(undefined)
                    }
                }
            ] 
        }).compile();

        usersControllers = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it('Should be defined', () => {
        expect(usersControllers).toBeDefined();
        expect(usersService).toBeDefined();
    });

    describe('findAllByType', () => {
        it('Should return a list of active architect users.', async () => {
            // Act
            const result = await usersService.findAllByType('ARCHITECT');
      
            // Assert
            expect(result).toEqual(userEntityList);
            expect(usersService.findAllByType).toHaveBeenCalledTimes(1);
          });
      
          it('Should return a list of active client users.', async () => {
            // Act
            const result = await usersService.findAllByType('CLIENT');
      
            // Assert
            expect(result).toEqual(userEntityList);
            expect(usersService.findAllByType).toHaveBeenCalledTimes(1);
          });
      
          it('Should throw an exception', () => {
            // Arrange
            jest.spyOn(usersService, 'findAllByType').mockRejectedValueOnce(new Error());
      
            // Assert
            expect(usersService.findAllByType('ARCHITECT')).rejects.toThrowError();
          });
    })

    describe('findOne', () => {
        it('Should return a user entity by ID.', async () => {
            // Act
            const result = await usersControllers.findOne('05a3eb02-0024-11ee-be56-0242ac120002');
        
            // Assert
            expect(result).toEqual(userEntityList[0]);
            expect(usersService.findOne).toHaveBeenCalledTimes(1);
        });
    
        it('Should throw a not found exception', async () => {
            // Act
            jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());
    
            // Assert
            await expect(usersControllers.findOne('05a3eb02-0024-11ee-be56-0242ac120002'))
                .rejects.toThrow(InternalServerErrorException);
            
            expect(usersService.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('Should create a new user entity item successfully', async () => {
             // Arrange
            const userToSave: CreateUserDto = {
                email: "user1@gmail.com",
                fullname: "user1",
                password: "123456",
                phone: "(55) 99999-9999",
                gender: "Outros",
                age: 18,
                role: "ARCHITECT"
            };
    
            // Act
            const result = await usersControllers.create(userToSave);
        
            // Assert
            expect(result).toEqual(userEntityList[0]);
            expect(usersService.create).toHaveBeenCalledTimes(1);
            expect(usersService.create).toHaveBeenCalledWith(userToSave);
        });
    
        it('should throw an exception', () => {
            // Arrange
            const userToSave: CreateUserDto = {
                email: "user1@gmail.com",
                fullname: "user1",
                password: "123456",
                phone: "(55) 99999-9999",
                gender: "Outros",
                age: 18,
                cau: 'DU232',
                role: "ARCHITECT"
            };
    
            jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error());
        
            // Assert
            expect(usersControllers.create(userToSave)).rejects.toThrowError();
        });
    });

    describe('update', () => {
        it('Should update an user entity.', async () => {
            // Arrange
            const toUpdateUser: UpdateUserDto = { fullname: 'username 1' };

            // Act
            const result = await usersControllers.update('05a3eb02-0024-11ee-be56-0242ac120002', toUpdateUser);

            // Assert
            expect(result).toEqual(userEntityList[0])
            expect(usersService.update).toHaveBeenCalledTimes(1);
        });

        it('Should throw an error occurs during update.', async () => {
            // Arrange
            const toUpdateUser: UpdateUserDto = { fullname: 'username 1' };

            // Act
            jest.spyOn(usersService, 'update').mockRejectedValueOnce(new Error());

            // Assert
            expect(usersControllers.update('05a3eb02-0024-11ee-be56-0242ac120002', toUpdateUser))
                .rejects.toThrowError();

            expect(usersService.update).toHaveBeenCalledTimes(1);
        })
    })

    describe('softDelete', () => {
        it('Should delete a user entity item successfully.', async () => {
            // Act
            const result = await usersControllers.remove('05a3eb02-0024-11ee-be56-0242ac120002');
        
            // Assert
            expect(result).toBeUndefined();
            expect(usersService.softDelete).toHaveBeenCalledTimes(1);
        });
    
        it('Should throw a ForbiddenException if an error occurs during delete', () => {
            // Arrange
            jest.spyOn(usersService, 'softDelete').mockRejectedValueOnce(new Error());
    
            // Assert
            expect(usersControllers.remove('05a3eb02-0024-11ee-be56-0242ac120002'))
                .rejects.toThrowError();

            expect(usersService.softDelete).toHaveBeenCalledTimes(1);
        })
    });
});