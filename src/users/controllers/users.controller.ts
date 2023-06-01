import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  ConflictException,
  InternalServerErrorException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ReturnUserDto } from '../dto/return-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/clients')
  @UseGuards(AuthGuard('jwt'))
  async findAllClients(): Promise<ReturnUserDto[]> {
    try {
      return await this.usersService.findAllByType('CLIENT');
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/architects')
  @UseGuards(AuthGuard('jwt'))
  async findAllArchitects(): Promise<ReturnUserDto[]> {
    try {
      return await this.usersService.findAllByType('ARCHITECT');
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('userId') userId: string): Promise<ReturnUserDto> {
    try {
      return await this.usersService.findOne(userId);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw  error.code.toString() == '23505' ?
      new ConflictException('O telefone ou email já está em uso') :
      new InternalServerErrorException('Erro ao salvar o usuário');
    }
  }

  @Put(':userId')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.softDelete(userId);
  }
}
