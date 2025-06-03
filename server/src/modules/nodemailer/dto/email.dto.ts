import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class sendEmailDto {
    @ApiProperty({
        description: 'Email người nhận',
        example: 'hdkien21@clc.fitus.edu.vn',
        type: String,
    })
    @IsString()
    @IsEmail()
    recipient: string[];

    @ApiProperty({
        description: 'Tiêu đề email',
        example: 'Welcome to Smashminton!',
        minLength: 1
    })
    @IsString()
    @IsNotEmpty({ message: 'Subject cannot be empty' })
    subject: string;

    @ApiProperty({
        description: 'Nội dung email dạng HTML',
        example: '<h1>Welcome!</h1><p>Thank you for joining us.</p>'
    })
    @IsString()
    @IsNotEmpty({ message: 'HTML content cannot be empty' })
    html: string;

    @ApiPropertyOptional({
        description: 'Nội dung email dạng text (tùy chọn)',
        example: 'Welcome! Thank you for joining us.'
    })
    @IsString()
    @IsOptional()
    text?: string;
}


export class SendCredentialsDto {
    @ApiProperty({
        description: 'Email nhân viên',
        example: 'hdkien21@clc.fitus.edu.vn'
    })
    @IsEmail({}, { message: 'Email must be valid' })
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({
        description: 'Username đăng nhập',
        example: 'employee123'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Password đăng nhập',
        example: 'TempPassword123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}