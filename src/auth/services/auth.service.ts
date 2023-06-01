import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './../../users/services/users.service';
import { CreateUserDto } from './../../users/dto/create-user.dto';
import { AuthUserResponse } from '../dto/auth-user-response.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {};

    async signUp(createUserDto: CreateUserDto): Promise<{ message: string, status: boolean }> {
        try {
            await this.usersService.create(createUserDto);
            return {
                message: 'Usuário cadastrado. Realize o login.',
                status: true
            }
        } catch(error) {
            return { message: error, status: false };
        }
    }

    async signIn(authUserDto: AuthUserDto): Promise<AuthUserResponse | null> {
        const user = await this.checkCredentials(authUserDto);
    
        if (user === null) {
            throw new UnauthorizedException('Usuário e/ou senha inválidos');
        }

        const jwtPayload = { id: user.id };

        const token = await this.jwtService.sign(jwtPayload);

        return { token };
    }

    async checkCredentials(authUserDto: AuthUserDto): Promise<AuthUserResponse> {
        const { email, password } = authUserDto;

        const user: User = await this.userRepository.findOneBy({
            email
        });
    
        if (user && (await user.checkPassword(password))) {

            delete user.password;
            delete user.hashSalt;

            return user;
        } else {
            return null;
        }
    }

}
