import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateShiftEnrollmentDto {
    @ApiProperty({ example: 55, description: 'Employee ID' })
    @IsNumber()
    employeeid: number;

    @ApiProperty({ example: 3, description: 'Shift ID' })
    @IsNumber()
    shiftid: number;

    @ApiProperty({ example: '2025-06-16', description: 'Shift date (YYYY-MM-DD)' })
    shiftdate: string;
}