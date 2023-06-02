import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateWorkRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe a descrição do trabalho'
    })
    @MaxLength(500, {
        message: 'A descrição deve ter menos de 500 caracteres',
    })
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe o cliente solicitante'
    })
    client: User;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Informe o arquiteto requisitado'
    })
    architect: User;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'O status da solicitação deve ser informado'
    })
    status?: 'Waiting' | 'Accepted' | 'Refused';
}
