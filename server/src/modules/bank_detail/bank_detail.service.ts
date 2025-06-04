import { Injectable } from '@nestjs/common';
import { CreateBankDetailDto } from './dto/create-bank_detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank_detail.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BankDetailService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createBankDetailDto: CreateBankDetailDto) {
    if (typeof createBankDetailDto.employeeid !== 'number') {
      throw new Error('employeeid must be provided and must be a number');
    }
    const bankDetailOfEmployee = await this.findAllByEmployeeID(createBankDetailDto.employeeid);

    let newBankDetail = null;
    if (bankDetailOfEmployee.length === 0) {
      newBankDetail = await this.prisma.bankDetail.create({
        data: {
          bankname: createBankDetailDto.bankname,
          banknumber: createBankDetailDto.banknumber,
          bankholder: createBankDetailDto.bankholder,
          active: true,
        }
      });
      return newBankDetail;
    }

    if (CreateBankDetailDto.active === true) {
      await this.prisma.bankDetail.update({
        where: {
          employeeid: createBankDetailDto.employeeid,
          active: true
        },
        data: {
          active: false
        }
      });
    }

    newBankDetail = await this.prisma.bankDetail.create({
      data: createBankDetailDto,
    });

    return newBankDetail;
  }

  findAllByEmployeeID(employeeid: number) {
    return this.prisma.bankDetail.findMany({
      where: { employeeid },
    });
  }

  async update(employeeid: number, active: boolean) {
    if (active === true) {
      await this.prisma.bankDetail.update({
        where: { employeeid, active: true },
        data: {
          active: false,
        },
      });
    }
    return this.prisma.bankDetail.update({
      where: { employeeid },
      data: {
        active,
      },
    });
  }

  // remove(employeeid: number, active: boolean) {
  //   if (active === true) {
    
  //   return this.prisma.bankDetail.delete({
  //     where: { id },
  //   });
  // }
}
