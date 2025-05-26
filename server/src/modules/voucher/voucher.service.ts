import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}
  create(createVoucherDto: CreateVoucherDto) {
    return 'This action adds a new voucher';
  }

  findAll() {
    return this.prisma.voucher.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
