import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentCardService } from './student_card.service';
import { CreateStudentCardDto } from './dto/create-student_card.dto';
import { UpdateStudentCardDto } from './dto/update-student_card.dto';

@Controller('student-card')
export class StudentCardController {
  constructor(private readonly studentCardService: StudentCardService) {}

  @Post()
  create(@Body() createStudentCardDto: CreateStudentCardDto) {
    return this.studentCardService.createStudentCard(createStudentCardDto);
  }

  @Get()
  findAll() {
    return this.studentCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentCardDto: UpdateStudentCardDto) {
    return this.studentCardService.update(+id, updateStudentCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentCardService.remove(+id);
  }
}
