import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class SigninAuthDto {
    @ApiProperty({ example: 'nguyenvun' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
