import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { updateEmployeeDto } from './dto/update-employee.dto';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from 'src/interfaces/pagination.interface';
import { Employee } from 'src/interfaces/employees.interface';
import * as bcrypt from 'bcryptjs';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService,
    private nodemailerService: NodemailerService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async getAllEmployees(
    page: number = 1,
    limit: number = 12,
    filter?: { role?: string[]; employee_type?: string[]; fingerprintid?: string[] }
  ): Promise<PaginatedResult<Employee[]>> {
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện where động
    const where: any = {
      accounts: {
        status: 'Active',
      },
    };
    if (filter?.role && Array.isArray(filter.role)) {
      where.role = { in: filter.role };
    }
    if (filter?.employee_type && Array.isArray(filter.employee_type)) {
      where.employee_type = { in: filter.employee_type };
    }
    // fingerprintid: hỗ trợ null, notnull, số, hoặc mảng
    if (filter?.fingerprintid && Array.isArray(filter.fingerprintid)) {
      const hasNull = filter.fingerprintid.includes('null');
      const hasNotNull = filter.fingerprintid.includes('notnull');
      if (hasNull && !hasNotNull) {
        where.fingerprintid = null;
      } else if (!hasNull && hasNotNull) {
        where.NOT = { ...(where.NOT || {}), fingerprintid: null };
      }
      // Nếu có cả null và notnull thì không filter gì cả
    }

    const employees = await this.prisma.employees.findMany({
      skip: skip,
      take: limit,
      where,
      select: {
        // Employee fields
        employeeid: true,
        fingerprintid: true,
        last_week_shift_type: true,
        employee_type: true,
        role: true,
        cccd: true,
        expiry_cccd: true,
        taxcode: true,
        salary: true,

        // Account fields (flatten)
        accounts: {
          select: {
            username: true,
            fullname: true,
            gender: true,
            email: true,
            dob: true,
            phonenumber: true,
            address: true,
            avatarurl: true,
            status: true,
            createdat: true,
          },
        },

        // Relations
        bank_detail: {
          select: {
            bankdetailid: true,
            bankname: true,
            banknumber: true,
            bankholder: true,
          },
          where: {
            active: true, // Chỉ lấy bank details đang active
          }
        },
        reward_records: {
          select: {
            rewardrecordid: true,
            rewarddate: true,
            finalrewardamount: true,
            rewardapplieddate: true,
            rewardruleid: true,
            employeeid: true,
            reward_rules: {
              select: {
                rewardname: true,
              }
            }
          },
          where: {
            rewarddate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
          },
        },

        penalty_records: {
          select: {
            penaltyrecordid: true,
            penaltyruleid: true,
            employeeid: true,
            violationdate: true,
            finalpenaltyamount: true,
            penaltyapplieddate: true,
            penalty_rules: {
              select: {
                penaltyname: true,
              }
            }
          },
          where: {
            violationdate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
          }
        },
      },
      orderBy: {
        employeeid: 'asc',
      },
    });

    // Làm phẳng với spread operator
    const flattenedEmployees: any[] = employees.map(employee => {
      const { accounts, ...employeeData } = employee;
      return {
        ...employeeData,
        ...accounts, // Spread tất cả fields từ accounts
      };
    });

    // Đếm tổng số bản ghi với filter
    const total = await this.prisma.employees.count({ where });
    const totalPages = Math.ceil(total / limit);

    return {
      data: flattenedEmployees,
      pagination: {
        page: page,
        totalPages: totalPages,
        //hasNext: page < totalPages,
      },
    };
  }

  async getEmployeeRoles(employeeId: number): Promise<string> {
    const employeeRole = await this.prisma.employees.findUnique({
      where: { employeeid: employeeId },
      select: {
        role: true
      },
    });

    if (!employeeRole) {
      return '';
    }

    return employeeRole.role || '';
  }

  async getEmployeeIdNotInArrayId(employeeIdsInShifts: number[]): Promise<any> {
    const employees = await this.prisma.employees.findMany({
      where: {
        employeeid: {
          notIn: employeeIdsInShifts,
        },
      },
      select: {
        employeeid: true,
        employee_type: true,
        accounts: {
          select: {
            fullname: true,
            avatarurl: true,
          },
        },
      },
    });
    return employees;
  }

  findOne(id: number) {
    return this.prisma.employees.findUnique({
      where: {
        employeeid: id
      }
    });
  }

  async update(id: number, updateEmployeeDto: updateEmployeeDto, file?: Express.Multer.File) {
    // Lấy account hiện tại
    const existingAccount = await this.prisma.accounts.findUnique({ where: { accountid: id } });
    if (!existingAccount) {
      throw new BadRequestException('Account not found');
    }

    let url_avatar: string = existingAccount.avatarurl || '';
    if (file) {
      // Upload file lên Cloudinary
      const uploadResults = await this.cloudinaryService.uploadAvatar(file);
      url_avatar = uploadResults.secure_url || '';
      if (!url_avatar) {
        throw new BadRequestException('Failed to upload avatar');
      }
    }

    // Phân tách trường update cho accounts và employees
    const { fullname, gender, email, dob, phonenumber, address, avatarurl, status, fingerprintid, employee_type, role, cccd, expiry_cccd, taxcode, salary } = updateEmployeeDto;

    // Update bảng employees
    const updatedEmployee = await this.prisma.employees.update({
      where: { employeeid: id },
      data: {
        fingerprintid: fingerprintid ? Number(fingerprintid) : null,
        employee_type: employee_type || null, // Mặc định nếu không có
        role: role || null, // Mặc định nếu không có
        cccd: cccd || null,
        expiry_cccd: expiry_cccd ? new Date(expiry_cccd) : null,
        taxcode: taxcode || null,
        salary: salary ? Number(salary) : null,
      },
    });

    // Update bảng accounts
    const updatedAccount = await this.prisma.accounts.update({
      where: { accountid: id },
      data: {
        ...(fullname && { fullname }),
        ...(email && { email }),
        ...(dob && { dob: new Date(dob) }),
        ...(phonenumber && { phonenumber }),
        ...(address && { address }),
        ...(status && { status }),
        ...(gender && { gender }),
        avatarurl: url_avatar,
      },
    });

    return { updatedAccount, updatedEmployee };
  }

  remove(ids: number[]) {
    return this.prisma.accounts.updateMany({
      where: {
        accountid: {
          in: ids
        }
      },
      data: { status: 'Inactive' }
    });
  }

  async addEmployee(addEmployeeDto: AddEmployeeDto) {
    const { fullname, dob, username, role, password, email } = addEmployeeDto;

    // Tạo username tự động nếu không có
    const generatedUsername = username || this.generateUsername(fullname);

    // Tạo password mặc định từ ngày sinh (DDMMYYYY) nếu không có
    const dobDate = new Date(dob);
    const defaultPassword = password || this.generateDefaultPassword(dobDate);

    // Hash password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Kiểm tra username đã tồn tại chưa
    const existingAccount = await this.prisma.accounts.findFirst({
      where: { username: generatedUsername }
    });

    if (existingAccount) {
      throw new Error(`Username "${generatedUsername}" đã tồn tại`);
    }

    try {
      // Tạo account và employee trong transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Tạo account trước
        const newAccount = await prisma.accounts.create({
          data: {
            username: generatedUsername,
            password: hashedPassword,
            fullname: fullname,
            email: email,
            dob: new Date(dob),
            status: 'Active',
            createdat: new Date(),
          }
        });

        // Tạo employee với accountid
        const newEmployee = await prisma.employees.create({
          data: {
            employeeid: newAccount.accountid,
            role: role,
            employee_type: 'Toàn thời gian', // Mặc định
          }
        });

        return {
          account: newAccount,
          employee: newEmployee,
          generatedUsername: generatedUsername,
          generatedPassword: defaultPassword // Trả về password gốc để gửi email
        };
      });

      // Gửi email thông báo tài khoản mới
      const emailResult = await this.nodemailerService.sendEmployeeCredentials({
        email: result.account.email ?? '',
        username: result.generatedUsername,
        password: result.generatedPassword
      });
      if (!emailResult || emailResult.accepted.length === 0) {
        throw new Error('Không thể gửi email thông báo tài khoản mới');
      }

      return result;
    } catch (error) {
      throw new Error(`Lỗi khi tạo nhân viên: ${error.message}`);
    }
  }

  // Hàm tạo username từ họ tên
  private generateUsername(fullname: string): string {
    // Chuyển về lowercase, bỏ dấu và khoảng trắng
    const normalized = fullname
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ''); // Bỏ khoảng trắng

    return normalized;
  }

  // Hàm tạo password mặc định từ ngày sinh (DDMMYYYY)
  private generateDefaultPassword(dob: Date): string {
    const day = dob.getDate().toString().padStart(2, '0');
    const month = (dob.getMonth() + 1).toString().padStart(2, '0');
    const year = dob.getFullYear().toString();

    return `${day}${month}${year}`;
  }
}
