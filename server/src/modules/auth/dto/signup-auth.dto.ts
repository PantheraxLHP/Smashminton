import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class SignupAuthDto  {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'john_doe' })
    username?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123' })
    repassword: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'john_doe@example.com' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    fullname?: string;

    @IsDate()
    @Type(() => Date)
    @ApiProperty({ example: '1990-01-01T00:00:00Z' })
    dob?: Date;

    @ApiProperty({ example: '1234567890' })
    phonenumber?: string;

    @ApiProperty({ example: '123 Main St' })
    address?: string;

    @ApiProperty({ example: 'Customer' })
    accounttype?: string;

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Array of student card pictures',
    })
    studentCard?: string[]; // Trường cho nhiều file ảnh
}
