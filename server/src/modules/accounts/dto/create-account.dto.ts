import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';
export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'john_doe' })
    username?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password123' })
    password: string;

    @ApiProperty({ example: 'password123' })
    repassword: string;

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

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Array of student card pictures',
    })
    studentCard?: string[]; // Trường cho nhiều file ảnh
}
