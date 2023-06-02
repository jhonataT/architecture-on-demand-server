import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ReturnUserDto } from '../dto/return-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllByType(userType: 'CLIENT' | 'ARCHITECT'): Promise<ReturnUserDto[]> {
    return await this.userRepository.find({
      where: { role: userType, isActive: true },
      select: ['id', 'fullname', 'email', 'isActive', 'role'],
    });
  }

  async findOne(userId: string): Promise<ReturnUserDto> {
    try {
      return await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'fullname', 'email', 'isActive', 'role'],
      }); 
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    try {
      const newSalt = await bcrypt.genSalt();
      const userDataToSave = this.userRepository.create({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password, newSalt),
        hashSalt: newSalt
      });
  
      const user = await this.userRepository.save(userDataToSave);
  
      delete user.password;
      delete user.hashSalt;
  
      return user;
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<ReturnUserDto> {
    try {
      await this.userRepository.update({ id: userId }, updateUserDto);
      return await this.findOne(userId);
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }

  async softDelete(userId: string): Promise<void> {
    try {
      await this.userRepository.softDelete({ id: userId });
      return;
    } catch(error) {
      throw new ForbiddenException(error.message);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
