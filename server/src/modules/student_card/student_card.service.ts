import { Injectable } from '@nestjs/common';
import { CreateStudentCardDto } from './dto/create-student_card.dto';
import { UpdateStudentCardDto } from './dto/update-student_card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentCardService {
  constructor(private prisma: PrismaService) { }
  createStudentCard(createStudentCardDto: CreateStudentCardDto) {
    if (!createStudentCardDto) {
      throw new Error('Invalid data');
    }

    const expireDate = new Date(Number(createStudentCardDto.studyperiod), 11, 31, 23, 59, 59);


    return this.prisma.student_card.create({
      data: {
        studentcardid: createStudentCardDto.studentcardid,
        schoolname: createStudentCardDto.schoolname,
        studentid: createStudentCardDto.studentid,
        studyperiod: expireDate,
      },
    });
  }

  findAll() {
    return this.prisma.student_card.findMany();
  }

  findOne(id: number) {
    return this.prisma.student_card.findUnique({
      where: { studentcardid: id },
    });
  }

  update(id: number, updateStudentCardDto: UpdateStudentCardDto) {
    return this.prisma.student_card.update({
      where: { studentcardid: id },
      data: updateStudentCardDto,
    });
  }

  remove(id: number) {
    return this.prisma.student_card.delete({
      where: { studentcardid: id },
    });
  }
}
