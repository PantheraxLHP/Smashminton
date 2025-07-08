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
    let newBankDetail;
    if (bankDetailOfEmployee.length === 0) {
      newBankDetail = await this.prisma.bank_detail.create({
        data: {
          bankname: createBankDetailDto.bankname,
          banknumber: createBankDetailDto.banknumber,
          bankholder: createBankDetailDto.bankholder,
          active: true,
          employeeid: createBankDetailDto.employeeid,
        }
      });
      return newBankDetail;
    }

    if (createBankDetailDto.active === true) {
      await this.prisma.bank_detail.updateMany({
        where: {
          employeeid: createBankDetailDto.employeeid,
          active: true
        },
        data: {
          active: false
        }
      });
    }

    newBankDetail = await this.prisma.bank_detail.create({
      data: createBankDetailDto,
    });

    return newBankDetail;
  }

  findAllByEmployeeID(employeeid: number) {
    console.log('employeeid', employeeid);
    return this.prisma.bank_detail.findMany({
      where: { employeeid },
    });
  }

  async update(employeeid: number, updateBankDetailDto: UpdateBankDetailDto) {
    await this.prisma.bank_detail.updateMany({
        where: { employeeid, active: true },
        data: {
          active: false,
        },
      });
    return this.prisma.bank_detail.update({
      where: { bankdetailid: updateBankDetailDto.bankdetailid },
      data: {
        active: updateBankDetailDto.active,
      },
    });
  }

  async remove(employeeid: number, updateBankDetailDto: UpdateBankDetailDto) {
    const bankDetailInActive = await this.prisma.bank_detail.findMany({
      where: { employeeid, active: false },
    });
    if (bankDetailInActive.length > 0 && updateBankDetailDto.active === true) {
      await this.prisma.bank_detail.update({
        where: { bankdetailid: bankDetailInActive[0].bankdetailid},
        data: {
          active: true,
        },
      });
    }
    return this.prisma.bank_detail.delete({
      where: { bankdetailid: updateBankDetailDto.bankdetailid },
    });
  }
}
