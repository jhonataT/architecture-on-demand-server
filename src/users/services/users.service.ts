import { Injectable } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const newSalt = await bcrypt.genSalt();

    const user = await this.userRepository.save({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password, newSalt),
      hashSalt: newSalt
    });

    delete user.password;
    delete user.hashSalt;

    return user;
  }

  async findAllByType(userType: 'CLIENT' | 'ARCHITECT'): Promise<ReturnUserDto[]> {
    const users = await this.userRepository.find({
      where: { role: userType, isActive: true },
      select: ['id', 'fullname', 'email', 'isActive', 'role'],
    });
    
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<ReturnUserDto | null> {
    const user = await this.userRepository.findOneBy({
      email
    });

    delete user.password;
    delete user.hashSalt;

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
