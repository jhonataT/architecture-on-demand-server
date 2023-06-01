import {
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { AuthService } from './../services/auth.service';
import { Controller, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { AuthUserResponse } from '../dto/auth-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('/register')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string, status: boolean }> {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (error) {
      if (error.code.toString() == '23505') {
        throw new ConflictException('O telefone ou email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário',
        );
      }
    }
  }

  @Post('/login')
  async signIn(@Body(ValidationPipe) authUserDto: AuthUserDto): Promise<AuthUserResponse | null> {
    try {
      return await this.authService.signIn(authUserDto);
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}
