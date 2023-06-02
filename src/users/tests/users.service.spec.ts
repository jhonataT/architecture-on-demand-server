import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const userEntityList: ReturnUserDto[]  = [
  new User({ id: '05a3eb02-0024-11ee-be56-0242ac120002', email: 'user1@gmail.com', fullname: 'user 1', role: 'ARCHITECT', isActive: true }),
  new User({ id: '4d298374-0024-11ee-be56-0242ac120002', email: 'user2@gmail.com', fullname: 'user 2', role: 'CLIENT', isActive: true }),
  new User({ id: '4d2986f8-0024-11ee-be56-0242ac120002', email: 'user3@gmail.com', fullname: 'user 3', role: 'ARCHITECT', isActive: true }),
  new User({ id: '4d2988f6-0024-11ee-be56-0242ac120002', email: 'user4@gmail.com', fullname: 'user 4', role: 'CLIENT', isActive: false })
];

const mockUserRepository = () => ({
  find: jest.fn().mockResolvedValue(userEntityList),
  findOne: jest.fn().mockResolvedValue(userEntityList[0]),
  create: jest.fn().mockReturnValue(userEntityList[0]),
  save: jest.fn().mockResolvedValue(userEntityList[0]),
  update: jest.fn().mockResolvedValue(userEntityList[0]),
  softDelete: jest.fn().mockResolvedValue(undefined),
});

// Testing UsersService methods:
describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Injetando mock-repository
        { provide: getRepositoryToken(User), useFactory: mockUserRepository }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  it('Should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAllByType', () => {
    it('Should return a list of active architect users.', async () => {
      // Act
      const result = await usersService.findAllByType('ARCHITECT');

      // Assert
      expect(result).toEqual(userEntityList);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: { role: 'ARCHITECT', isActive: true },
        select: ['id', 'fullname', 'email', 'isActive', 'role'],
      });
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Should return a list of active client users.', async () => {
      // Act
      const result = await usersService.findAllByType('CLIENT');

      // Assert
      expect(result).toEqual(userEntityList);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: { role: 'CLIENT', isActive: true },
        select: ['id', 'fullname', 'email', 'isActive', 'role'],
      });
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', () => {
      // Arrange
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersService.findAllByType('ARCHITECT')).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('Should return a user entity successfully.', async () => {
      // Act
      const result = await usersService.findOne('05a3eb02-0024-11ee-be56-0242ac120002');

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    })

    it('Should throw a not found exception', () => {
      // Act
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersService.findOne('05a3eb02-0024-11ee-be56-0242ac120002')).rejects.toThrowError(
        NotFoundException
      );
    })
  });

  describe('create', () => {
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

    it('Should create a new user entity item successfully.', async () => {
      // Act
      const result = await usersService.create(userToSave);

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', () => {
      // Act
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersService.create(userToSave)).rejects.toThrowError(
        ForbiddenException
      )
    })
  });

  describe('update', () => {
    it('Should update a user entity item successfully', async () => {
      // Arrange
      const expectedUpdatedUser: UpdateUserDto = { fullname: 'username 1' };

      // Act
      const result = await usersService.update('05a3eb02-0024-11ee-be56-0242ac120002', expectedUpdatedUser);

      // Assert
      expect(result).toEqual(userEntityList[0]);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });

    it('Should throw a ForbiddenException if an error occurs during update', () => {
      // Arrange
      const expectedUpdatedUser: UpdateUserDto = { fullname: 'username 1' };

      // Arrange
      jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersService.update('05a3eb02-0024-11ee-be56-0242ac120002', expectedUpdatedUser)).rejects.toThrowError(
        ForbiddenException
      );
    })
  });

  describe('softDelete', () => {
    it('Should delete a user entity item successfully.', async () => {
      // Act
      const result = await usersService.softDelete('05a3eb02-0024-11ee-be56-0242ac120002');

      // Assert
      expect(result).toBeUndefined();
      expect(userRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('Should throw a ForbiddenException if an error occurs during delete', () => {
      // Act
      jest.spyOn(userRepository, 'softDelete').mockRejectedValueOnce(new Error());

      // Assert
      expect(usersService.softDelete('05a3eb02-0024-11ee-be56-0242ac120002')).rejects.toThrowError(
        ForbiddenException
      );
    })
  });
});
