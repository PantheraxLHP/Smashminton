import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateShiftAssignmentDto {
  @ApiProperty({ example: 1, description: 'ID của nhân viên' })
  @IsInt()
  employeeid: number;

  @ApiProperty({ example: 2, description: 'ID của ca làm việc' })
  @IsInt()
  shiftid: number;

  @ApiProperty({ example: '2025-06-12T08:00:00.000Z', description: 'Ngày ca làm việc (ISO 8601)' })
  @IsDateString()
  shiftdate: string;

  @ApiPropertyOptional({ example: 'approved', description: 'Trạng thái phân công (có thể để trống)' })
  @IsOptional()
  @IsString()
  assignmentstatus?: string;
}