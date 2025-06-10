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
      AND: [
        // Luôn loại bỏ admin
        {
          role: { not: 'admin' }
        }
      ]
    };

    // Thêm role filter nếu có (nhưng vẫn loại bỏ admin)
    if (filter?.role && Array.isArray(filter.role)) {
      const nonAdminRoles = filter.role.filter(role => role !== 'admin');

      if (nonAdminRoles.length > 0) {
        where.AND.push({
          role: { in: nonAdminRoles }
        });
      }
      // Nếu nonAdminRoles.length === 0, chỉ có điều kiện not admin ở trên
    }

    if (filter?.employee_type && Array.isArray(filter.employee_type)) {
      where.employee_type = { in: filter.employee_type };
    }

    // fingerprintid logic giữ nguyên
    if (filter?.fingerprintid && Array.isArray(filter.fingerprintid)) {
      const hasNull = filter.fingerprintid.includes('null');
      const hasNotNull = filter.fingerprintid.includes('notnull');
      if (hasNull && !hasNotNull) {
        where.fingerprintid = null;
      } else if (!hasNull && hasNotNull) {
        where.NOT = { ...(where.NOT || {}), fingerprintid: null };
      }
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
            active: true,
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

  async getEmployeeIdNotInArrayId(employeeIdsInShifts: number[], page: number, limit: number): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;
    const take = limit;
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
      skip: skip,
      take: take,
      orderBy: {
        employeeid: 'asc'
      }
    });
    const total = await this.prisma.employees.count({
      where: {
        employeeid: {
          notIn: employeeIdsInShifts,
        },
      },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data: employees,
      pagination: {
        page: page,
        totalPages: totalPages,
        //hasNext: page < totalPages,
      },
    };
  }

  // findOne(id: number) {
  //   return this.prisma.employees.findUnique({
  //     where: {
  //       employeeid: id
  //     }
  //   });
  // }

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
        employee_type: employee_type || null,
        role: role || null,
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
            employee_type: 'Full-time', // Mặc định
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

  async searchEmployees(
    searchTerm: string
  ): Promise<any[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const trimmedSearch = searchTerm.trim();

    const whereCondition: any = {
      accounts: {
        status: 'Active'
      },
      role: { not: 'admin' },
      OR: []
    };

    // Parse search term
    let searchId: number | null = null;
    let searchName: string = '';

    if (trimmedSearch.includes('-')) {
      const parts = trimmedSearch.split('-', 2);
      const leftPart = parts[0].trim();
      const rightPart = parts[1] ? parts[1].trim() : '';

      // Extract ID if present
      if (leftPart && !isNaN(parseInt(leftPart))) {
        searchId = parseInt(leftPart);
      }

      // Extract name if present
      if (rightPart) {
        searchName = rightPart;
      } else if (leftPart && isNaN(parseInt(leftPart))) {
        searchName = leftPart;
      }

      // ✅ KEY FIX: Nếu có cả ID và name, chỉ tìm kết hợp chính xác
      if (searchId !== null && searchName) {
        whereCondition.OR.push({
          AND: [
            { employeeid: searchId },
            {
              accounts: {
                fullname: {
                  contains: searchName,
                  mode: 'insensitive'
                }
              }
            }
          ]
        });
      }
      // Nếu chỉ có ID
      else if (searchId !== null && !searchName) {
        whereCondition.OR.push({
          employeeid: searchId
        });
      }
      // Nếu chỉ có name
      else if (!searchId && searchName) {
        whereCondition.OR.push({
          accounts: {
            fullname: {
              contains: searchName,
              mode: 'insensitive'
            }
          }
        });
      }
    } else {
      // No dash - could be ID or name
      if (/^\d+$/.test(trimmedSearch)) {
        whereCondition.OR.push({
          employeeid: parseInt(trimmedSearch)
        });
      } else {
        whereCondition.OR.push({
          accounts: {
            fullname: {
              contains: trimmedSearch,
              mode: 'insensitive'
            }
          }
        });
      }
    }

    const employees = await this.prisma.employees.findMany({
      where: whereCondition,
      take: 50,
      select: {
        employeeid: true,
        salary: true,
        accounts: {
          select: {
            fullname: true,
          }
        }
      },
      orderBy: [
        { employeeid: 'asc' },
        { accounts: { fullname: 'asc' } }
      ]
    });

    return employees.map(employee => ({
      search: `${employee.employeeid}-${employee.accounts.fullname}`,
      salary: employee.salary
    }));
  }
}
