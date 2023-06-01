import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ReturnUserDto } from 'src/users/dto/return-user.dto';

export class AuthUserResponse extends PartialType(ReturnUserDto) {
    @ApiProperty()
    @IsString()
    token?: string
}
