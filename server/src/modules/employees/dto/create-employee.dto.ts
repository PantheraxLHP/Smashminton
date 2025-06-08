import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEmail, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Employee ID', example: 1 })
    @IsNumber()
    employeeid: number;

    @ApiProperty({ description: 'Username', example: 'john.doe', required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ description: 'Full name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    fullname?: string;

    @ApiProperty({ description: 'Gender', example: 'Male', required: false })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ description: 'Account status', example: 'Active', required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Email address', example: 'john.doe@example.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Date of birth', example: '1990-01-01', required: false })
    @IsOptional()
    @IsDateString()
    dob?: Date;

    @ApiProperty({ description: 'Phone number', example: '+84123456789', required: false })
    @IsOptional()
    @IsString()
    phonenumber?: string;

    @ApiProperty({ description: 'Address', example: '123 Main St, City', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    avatarurl?: string;

    @ApiProperty({ description: 'Fingerprint ID', example: 12345, required: false })
    @IsOptional()
    @IsNumber()
    fingerprintid?: number;

    @ApiProperty({ description: 'Employee type', example: 'Toàn thời gian', required: false })
    @IsOptional()
    @IsString()
    employee_type?: string;

    @ApiProperty({ description: 'Role', example: 'Manager', required: false })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiProperty({ description: 'CCCD number', example: '123456789012', required: false })
    @IsOptional()
    @IsString()
    cccd?: string;

    @ApiProperty({ description: 'CCCD expiry date', example: '2030-01-01', required: false })
    @IsOptional()
    @IsDateString()
    expiry_cccd?: Date;

    @ApiProperty({ description: 'Tax code', example: 'TAX123456', required: false })
    @IsOptional()
    @IsString()
    taxcode?: string;

    @ApiProperty({ description: 'Salary', example: 50000, required: false })
    @IsOptional()
    @IsNumber()
    salary?: number;

    @ApiProperty({ description: 'Created date', example: '2024-01-01T00:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    createdat?: Date;
}
