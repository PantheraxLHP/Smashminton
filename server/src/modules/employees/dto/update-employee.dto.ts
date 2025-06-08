import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEmail, IsDateString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class updateEmployeeDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Full name', example: 'Lê Hồng C', required: false })
    fullname?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Gender', example: 'Nữ', required: false })
    gender?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Account status', example: 'Active', required: false })
    status?: string;

    @IsOptional()
    @ApiProperty({ description: 'Email address', example: 'lehongc@example.com', required: false })
    email?: string;

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({ description: 'Date of birth', example: '1991-03-03T00:00:00Z', required: false })
    dob?: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Phone number', example: '0369852147', required: false })
    phonenumber?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Address', example: '123 Main St, City', required: false })
    address?: string;

    @ApiProperty({
        description: 'Avatar image file',
        type: 'string',
        format: 'binary',
        required: false,
    })
    avatarurl?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ description: 'Fingerprint ID', example: 123, required: false })
    fingerprintid?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Employee type', example: 'Toàn thời gian', required: false })
    employee_type?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Role', example: 'employee', required: false })
    role?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'CCCD number', example: '123456789012', required: false })
    cccd?: string;

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({ description: 'CCCD expiry date', example: '2030-01-01T00:00:00Z', required: false })
    expiry_cccd?: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Tax code', example: 'TAX123456', required: false })
    taxcode?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ description: 'Salary', example: 50000, required: false })
    salary?: number;
}