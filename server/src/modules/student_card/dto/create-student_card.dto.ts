import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
``
export class CreateStudentCardDto {
    @ApiProperty({ example: "1" })
    @IsNotEmpty()
    studentcardid: number;

    @ApiProperty({ example: "UNIVERSITY OF SCIENCE" })
    @IsString()
    schoolname: string;

    @ApiProperty({ example: "21127083" })
    @IsString()
    studentid: string;

    @ApiProperty({ example: "2025" })
    @IsString()
    @IsNotEmpty()
    studyperiod: string;
}
