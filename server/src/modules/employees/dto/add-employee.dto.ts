import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class AddEmployeeDto {
    @ApiProperty({
        description: 'Họ tên nhân viên',
        example: 'Hoàng Đức Kiên'
    })
    @IsString()
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullname: string;

    @ApiProperty({
        description: 'Ngày sinh (YYYY-MM-DD)',
        example: '1990-01-15'
    })
    @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
    dob: string;

    @ApiProperty({
        description: 'Tên đăng nhập (sẽ tự động tạo nếu để trống)',
        example: null,
        required: false
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        description: 'Vai trò',
        example: 'hr_manager',
        enum: ['wh_manager', 'hr_manager', 'employee']
    })
    @IsString()
    @IsNotEmpty({ message: 'Vui lòng chọn vai trò' })
    role: string;

    @ApiProperty({
        description: 'Mật khẩu (mặc định là ngày sinh DDMMYYYY)',
        example: null,
        required: false
    })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({
        description: 'Email nhân viên để gửi thông tin tài khoản',
        example: 'hdkien21@clc.fitus.edu.vn'
    })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
} 