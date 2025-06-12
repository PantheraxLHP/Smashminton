import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateShiftAssignmentDto {
    @ApiProperty({
        example: 1,
        description: 'ID of the shift',
        type: Number,
    })
    @IsNumber()
    shiftid: number;

    @ApiProperty({
        example: '2025-06-25',
        description: 'Date of the shift in format YYYY-MM-DD',
        type: String,
    })
    @IsString()
    shiftdate: string;

    @ApiProperty({
        example: 55,
        description: 'ID of the employee',
        type: Number,
    })
    @IsNumber()
    employeeid: number;
}