import { ApiProperty } from '@nestjs/swagger';
export class CreateAccountDto {
    @ApiProperty({ example: 'john_doe' })
    username?: string;

    @ApiProperty({ example: 'password123' })
    password?: string;

    @ApiProperty({ example: 'active' })
    status?: string;

    @ApiProperty({ example: 'John Doe' })
    fullname?: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email?: string;

    @ApiProperty({ example: '1990-01-01T00:00:00Z' })
    dob?: Date;

    @ApiProperty({ example: 'male' })
    gender?: string;

    @ApiProperty({ example: '1234567890' })
    phonenumber?: string;

    @ApiProperty({ example: '123 Main St' })
    address?: string;

    @ApiProperty({ example: 'http://example.com/avatar.jpg' })
    avatarurl?: string;

    @ApiProperty({ example: 'Customer' })
    accounttype?: string;
}
