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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
