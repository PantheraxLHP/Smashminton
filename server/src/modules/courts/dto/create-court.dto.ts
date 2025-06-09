import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateCourtDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Court B4' })
  courtname?: string;

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

