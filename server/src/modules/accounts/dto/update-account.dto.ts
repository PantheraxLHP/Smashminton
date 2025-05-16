import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccountDto {
    @ApiProperty({ example: 'Nguyễn Vũ N', required: false })
    fullname?: string;

    @ApiProperty({example: 'Male', required: false })
    @IsString()
    gender?: string;

    @ApiProperty({ example: 'nguyenvun@example.com', required: false })
    @IsString()
    email?: string;

    @IsDate()
    @Type(() => Date)
    @ApiProperty({ example: '2000-02-02T00:00:00Z', required: false }) 
    dob?: Date;

    @ApiProperty({ example: '0123456789', required: false })
    phonenumber?: string;

    @ApiProperty({ example: '123 Đường N, Quận Bình Thạnh' })
    address?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
    })
    avatarurl?: string;
}
