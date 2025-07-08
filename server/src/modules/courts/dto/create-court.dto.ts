import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateCourtDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Court B4', required: false})
  courtname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Active' })
  statuscourt?: string;

  @IsOptional()
  @ApiProperty({ type: Number, example: 5.0, })
  avgrating?: number;

  @IsOptional()
  @ApiProperty({ type: String, example: '2025-05-15T09:00:00Z' })
  timecalculateavg?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Hình ảnh của sân',
  })
  courtimgurl?: string;

  @IsOptional()
  @ApiProperty({ type: Number, description: 'ID của zone chứa sân này', example: 2, required: true })
  zoneid?: number;
}

