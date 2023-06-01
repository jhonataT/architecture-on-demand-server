import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsBoolean,
} from "class-validator";

export class ReturnUserDto {
    @ApiProperty()
    @IsString()
    id?: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    fullname: string;

    @ApiProperty()
    @IsString()
    phone?: string;

    @ApiProperty()
    @IsString()
    gender?: string;

    @ApiProperty()
    @IsNumber()
    age?: number;

    @ApiProperty()
    @IsString()
    role: 'ARCHITECT' | 'CLIENT';

    @ApiProperty()
    @IsBoolean()
    isActive?: boolean;
}
