import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentCardDto } from './create-student_card.dto';

export class UpdateStudentCardDto extends PartialType(CreateStudentCardDto) {}
