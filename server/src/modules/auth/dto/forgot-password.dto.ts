import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Email hoặc username để lấy lại mật khẩu',
        example: 'hdkien21@clc.fitus.edu.vn'
    })
    identifier: string;
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Token để reset password',
        example: '1234567890'
    })
    token: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Mật khẩu mới',
        example: '1234'
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Xác nhận mật khẩu',
        example: '1234'
    })
    confirmPassword: string;
  }