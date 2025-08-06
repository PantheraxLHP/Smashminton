import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccountDto {
    @ApiProperty({ example: 'Nguyễn Vũ N', required: false })
    @IsOptional()
    @IsString()
    fullname?: string;

    @ApiProperty({ example: 'Male', required: false })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ example: 'nguyenvun@example.com', required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ example: '2000-02-02T00:00:00Z', required: false })
    dob?: Date;

    @ApiProperty({ example: '0123456789', required: false })
    @IsOptional()
    phonenumber?: string;

    @ApiProperty({ example: '123 Đường N, Quận Bình Thạnh', required: false })
    @IsOptional()
    address?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
    })
    avatarurl?: string;
}
