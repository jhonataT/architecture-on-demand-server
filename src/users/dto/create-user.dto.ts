import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe o seu email'
    })
    @IsEmail(
        {},
        { message: 'Informe um endereço de email válido' },
      )
    @MaxLength(200, {
        message: 'O email deve ter menos de 200 caracteres',
    })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe o seu nome completo'
    })
    @MaxLength(200, {
        message: 'O nome deve ter menos de 200 caracteres',
    })
    fullname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe uma senha',
    })
    @MinLength(6, {
        message: 'A senha deve ter no mínimo 6 caracteres',
    })
    password: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsNumber()
    age: number;

    @ApiProperty()
    @IsString()
    role: 'ARCHITECT' | 'CLIENT';
}

