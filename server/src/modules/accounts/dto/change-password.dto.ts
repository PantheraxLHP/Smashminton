import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'New password for the user',
        example: '124',
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Confirm new password for the user',
        example: '124',
    })
    confirmPassword: string;
}