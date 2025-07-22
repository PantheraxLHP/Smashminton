import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateRewardRecordDto } from './dto/create-reward_record.dto';
import { UpdateRewardRecordDto } from './dto/update-reward_record.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from 'src/interfaces/pagination.interface';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class RewardRecordsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getEmployeesInRewardRecords(
        page: number = 1,
        pageSize: number = 12,
        filters?: {
            month?: number;
            year?: number;
            role?: string[];
            employee_type?: string[];
            rewardrecordstatus?: string[];
        }
    ): Promise<PaginatedResult<any>> {
        const skip = (page - 1) * pageSize;

        // Xây dựng điều kiện where động
        const whereCondition: any = {
            employees: {
                accounts: {
                    status: 'Active'
                },
                AND: [
                    // Luôn loại bỏ admin
                    {
                        role: { not: 'admin' }
                    }
                ]
            }
        };

        // Filter theo tháng và năm
        if (filters?.month || filters?.year) {
            const currentDate = new Date();
            const filterMonth = filters.month || (currentDate.getMonth() + 1);
            const filterYear = filters.year || currentDate.getFullYear();

            whereCondition.rewarddate = {
                gte: new Date(filterYear, filterMonth - 1, 1), // Đầu tháng
                lt: new Date(filterYear, filterMonth, 1), // Đầu tháng tiếp theo
            };
        }

        // Filter theo role (có thể chọn nhiều) - nhưng vẫn loại bỏ admin
        if (filters?.role && filters.role.length > 0) {
            const nonAdminRoles = filters.role.filter(role => role !== 'admin');

            if (nonAdminRoles.length > 0) {
                whereCondition.employees.AND.push({
                    role: { in: nonAdminRoles }
                });
            }
        }

        // Filter theo employee_type (có thể chọn nhiều)
        if (filters?.employee_type && filters.employee_type.length > 0) {
            whereCondition.employees.employee_type = { in: filters.employee_type };
        }

        // Filter theo rewardrecordstatus (có thể chọn nhiều)
        if (filters?.rewardrecordstatus && filters.rewardrecordstatus.length > 0) {
            whereCondition.rewardrecordstatus = { in: filters.rewardrecordstatus };
        }

        // Query với phân trang và filter
        const employees_reward_records = await this.prisma.reward_records.findMany({
            skip: skip,
            take: pageSize,
            where: whereCondition,
            include: {
                employees: {
                    select: {
                        employeeid: true,
                        role: true,
                        employee_type: true,
                        accounts: {
                            select: {
                                fullname: true,
                                accounttype: true,
                                avatarurl: true,
                            },
                        }
                    }
                },
                reward_rules: true,
            },
            orderBy: {
                rewarddate: 'desc'
            }
        });

        // Đếm tổng số records với cùng điều kiện filter
        const total = await this.prisma.reward_records.count({
            where: whereCondition
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            data: employees_reward_records,
            pagination: {
                page: page,
                totalPages: totalPages,
            },
        };
    }

    async searchEmployeesInRewardRecord(
        query: string = '',
        page: number = 1,
        pageSize: number = 12,
        filters?: {
            month?: number;
            year?: number;
            role?: string[];
            employee_type?: string[];
            rewardrecordstatus?: string[];
        }
    ): Promise<PaginatedResult<any>> {
        // Xây dựng điều kiện where động
        const whereCondition: any = {};

        // Filter theo employee (thông qua relation)
        const employeeCondition: any = {
            accounts: {
                status: 'Active'
            },
            role: { not: 'admin' }
        };

        // Xử lý search query theo format 'accountid-fullname'
        if (query && query.trim()) {
            const trimmedQuery = query.trim();
            let accountId: number | undefined;
            let namePart: string | undefined;

            if (trimmedQuery.includes('-')) {
                // Trường hợp có dấu gạch: "5-Nguyen" hoặc "5-Nguyen Van A"
                const parts = trimmedQuery.split('-', 2);
                const leftPart = parts[0].trim();
                const rightPart = parts[1] ? parts[1].trim() : '';

                // Kiểm tra phần trái có phải số không
                if (leftPart && !isNaN(parseInt(leftPart))) {
                    accountId = parseInt(leftPart);
                }

                // Phần phải là tên
                if (rightPart) {
                    namePart = rightPart;
                } else if (leftPart && isNaN(parseInt(leftPart))) {
                    namePart = leftPart;
                }

                // Xử lý điều kiện search
                if (accountId !== undefined && namePart) {
                    // Có cả accountid và fullname: tìm chính xác
                    employeeCondition.AND = [
                        { employeeid: accountId },
                        { accounts: { ...employeeCondition.accounts, fullname: { contains: namePart, mode: 'insensitive' } } }
                    ];
                } else if (accountId !== undefined && !namePart) {
                    // Chỉ có accountid
                    employeeCondition.employeeid = accountId;
                } else if (!accountId && namePart) {
                    // Chỉ có fullname
                    employeeCondition.accounts = {
                        ...employeeCondition.accounts,
                        fullname: { contains: namePart, mode: 'insensitive' }
                    };
                }
            } else {
                // Không có dấu gạch: có thể là accountid hoặc fullname
                if (/^\d+$/.test(trimmedQuery)) {
                    // Là số: tìm theo accountid
                    employeeCondition.employeeid = parseInt(trimmedQuery);
                } else {
                    // Là text: tìm theo fullname
                    employeeCondition.accounts = {
                        ...employeeCondition.accounts,
                        fullname: { contains: trimmedQuery, mode: 'insensitive' }
                    };
                }
            }
        }

        // Filter theo role (có thể chọn nhiều) - nhưng vẫn loại bỏ admin
        if (filters?.role && filters.role.length > 0) {
            const nonAdminRoles = filters.role.filter(role => role !== 'admin');
            if (nonAdminRoles.length > 0) {
                if (employeeCondition.AND) {
                    // Nếu đã có AND condition từ search, thêm role vào
                    employeeCondition.AND.push({ role: { in: nonAdminRoles } });
                } else {
                    employeeCondition.role = { in: nonAdminRoles };
                }
            }
        }

        // Filter theo employee_type
        if (filters?.employee_type && filters.employee_type.length > 0) {
            if (employeeCondition.AND) {
                employeeCondition.AND.push({ employee_type: { in: filters.employee_type } });
            } else {
                employeeCondition.employee_type = { in: filters.employee_type };
            }
        }

        // Gán employee condition vào where
        whereCondition.employees = employeeCondition;

        // Filter theo tháng và năm
        if (filters?.month || filters?.year) {
            const currentDate = new Date();
            const filterMonth = filters.month || (currentDate.getMonth() + 1);
            const filterYear = filters.year || currentDate.getFullYear();

            whereCondition.rewardapplieddate = {
                gte: new Date(filterYear, filterMonth - 1, 1),
                lt: new Date(filterYear, filterMonth, 1),
            };
        }

        // Filter theo rewardrecordstatus
        if (filters?.rewardrecordstatus && filters.rewardrecordstatus.length > 0) {
            whereCondition.rewardrecordstatus = { in: filters.rewardrecordstatus };
        }

        // Đếm tổng số bản ghi với filter TRƯỚC KHI query
        const total = await this.prisma.reward_records.count({ where: whereCondition });
        const totalPages = Math.ceil(total / pageSize);

        // Reset page về 1 nếu vượt quá tổng số trang và có kết quả
        if (page > totalPages && totalPages >= 0) {
            page = 1;
        }

        // Tính skip sau khi đã reset page
        const skip = (page - 1) * pageSize;
        // Query với phân trang và filter
        const employees_reward_records = await this.prisma.reward_records.findMany({
            skip: skip,
            take: pageSize,
            where: whereCondition,
            include: {
                employees: {
                    select: {
                        employeeid: true,
                        role: true,
                        employee_type: true,
                        accounts: {
                            select: {
                                fullname: true,
                                accounttype: true,
                                avatarurl: true,
                            },
                        }
                    }
                },
                reward_rules: true,
            },
            orderBy: {
                rewarddate: 'desc'
            }
        });

        return {
            data: employees_reward_records,
            pagination: {
                page: page,
                totalPages: totalPages,
            },
        };
    }

    approvedReward(ids: number[]) {
        return this.prisma.reward_records.updateMany({
            where: {
                rewardrecordid: {
                    in: ids
                }
            },
            data: { rewardrecordstatus: 'approved' }
        });
    }

    rejectedReward(ids: number[]) {
        return this.prisma.reward_records.updateMany({
            where: {
                rewardrecordid: {
                    in: ids
                }
            },
            data: { rewardrecordstatus: 'rejected' }
        });
    }

    async getAllRewardRules() {
        const rewardRules = await this.prisma.reward_rules.findMany({
            select: {
                rewardruleid: true,
                rewardname: true,
                rewardvalue: true,
            },
            orderBy: {
                rewardruleid: 'asc'
            }
        });

        // Convert rewardvalue to number
        return rewardRules.map(rule => ({
            ...rule,
            rewardvalue: rule.rewardvalue ? Number(rule.rewardvalue) : 0
        }));
    }
    async create(createRewardRecordDto: CreateRewardRecordDto) {
        const rewardRecord = await this.prisma.reward_records.create({
            data: {
                ...createRewardRecordDto,
                rewarddate: new Date(),
            },
        });

        if (!rewardRecord) {
            throw new Error('Failed to create reward record');
        }

        return rewardRecord;
    }

    async updateRewardNote(rewardrecordid: number, rewardnote: string) {
        const status = await this.prisma.reward_records.findUnique({
            where: { rewardrecordid: rewardrecordid },
        });
        if (status && status.rewardrecordstatus !== 'pending') {
            throw new BadRequestException('Reward record is not pending');
        }
        if (!status) {
            throw new BadRequestException('Reward record not found');
        }
        return this.prisma.reward_records.update({
            where: { rewardrecordid: rewardrecordid },
            data: { rewardnote: rewardnote }
        });
    }

    @Cron('0 0 1 * *')
    async monthlyAttendanceReward() {
        Logger.log("Starting monthly attendance reward record creation...");
        const employees = await this.prisma.employees.findMany({
            where: {
                employeeid: {
                    not: 1
                },
                accounts: {
                    status: 'Active'
                }
            },
        });

        if (employees.length === 0) {
            Logger.log("No active employees found, skipping monthly attendance reward record creation.");
            return;
        }
        
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        lastMonthStart.setHours(0, 0, 0, 0);
        const lastMonthEnd = new Date(lastMonthStart);
        lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
        lastMonthEnd.setDate(0);
        lastMonthEnd.setHours(23, 59, 59, 999);

        const absenceRule = await this.prisma.penalty_rules.findFirst({
            where: {
                penaltyname: 'Phạt nghỉ không phép',
            }
        });

        if (!absenceRule) {
            Logger.log("No absence rule found or not valid, skipping monthly attendance reward record creation.");
            return;
        }

        const lateRule = await this.prisma.penalty_rules.findFirst({
            where: {
                penaltyname: 'Phạt đi trễ',
            }
        });

        if (!lateRule) {
            Logger.log("No late rule found or not valid, skipping monthly attendance reward record creation.");
            return;
        }

        const attendanceRule = await this.prisma.reward_rules.findFirst({
            where: {
                rewardname: 'Thưởng chuyên cần',
            }
        });

        if (!attendanceRule) {
            Logger.log("No attendance rule found or not valid, skipping monthly attendance reward record creation.");
            return;
        }

        const rewardRecords: any[] = [];
        for (const employee of employees) {
            const absenceCount = await this.prisma.penalty_records.count({
                where: {
                    employeeid: employee.employeeid,
                    penaltyruleid: absenceRule.penaltyruleid,
                    violationdate: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd
                    }
                }
            });

            const lateCount = await this.prisma.penalty_records.count({
                where: {
                    employeeid: employee.employeeid,
                    penaltyruleid: lateRule.penaltyruleid,
                    violationdate: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd
                    }
                }
            });

            const assignmentCount = await this.prisma.shift_assignments.count({
                where: {
                    employeeid: employee.employeeid,
                    shiftdate: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd
                    }
                }
            });

            if (absenceCount > 0 || lateCount > 0 || assignmentCount < 45) {
                continue;
            } else {
                const finalRewardAmount = (Number(attendanceRule.rewardvalue || 0) + 1) * Number(employee.salary || 0);

                rewardRecords.push({
                    employeeid: employee.employeeid,
                    rewardruleid: attendanceRule.rewardruleid,
                    rewarddate: lastMonthEnd,
                    rewardapplieddate: lastMonthEnd,
                    rewardrewardstatus: 'pending',
                    rewardnote: `Thưởng chuyên cần tháng ${lastMonthStart.toLocaleDateString('vi-VN', { month: 'long' })}, ${lastMonthStart.getFullYear()}`,
                    finalrewardamount: finalRewardAmount,
                });
            }
        }

        if (rewardRecords.length > 0) {
            await this.prisma.reward_records.createMany({
                data: rewardRecords,
            });
            Logger.log(`Successfully created ${rewardRecords.length} monthly attendance reward records.`);
        }
    }

    @Cron('0 0 1 1 *')
    async newYearReward() {
        Logger.log("Starting new year reward record creation...");
        const employees = await this.prisma.employees.findMany({
            where: {
                employeeid: {
                    not: 1
                },
                accounts: {
                    status: 'Active'
                }
            },
        });

        if (employees.length === 0) {
            Logger.log("No active employees found, skipping new year reward record creation.");
            return;
        }

        const newYearRule = await this.prisma.reward_rules.findFirst({
            where: {
                rewardname: 'Thưởng ngày lễ',
            }
        });

        if (!newYearRule) {
            Logger.log("No holiday rule found or not valid, skipping new year reward record creation.");
            return;
        }

        const rewardRecords: any[] = [];
        for (const employee of employees) {
                const finalRewardAmount = (Number(newYearRule.rewardvalue || 0) + 1) * Number(employee.salary || 0);

                rewardRecords.push({
                    employeeid: employee.employeeid,
                    rewardruleid: newYearRule.rewardruleid,
                    rewarddate: new Date(),
                    rewardapplieddate: new Date(),
                    rewardrecordstatus: 'pending',
                    rewardnote: `Thưởng tết dương lịch năm ${new Date().getFullYear()}`,
                    finalrewardamount: finalRewardAmount,
                });
        }

        if (rewardRecords.length > 0) {
            await this.prisma.reward_records.createMany({
                data: rewardRecords,
            });
            Logger.log(`Successfully created ${rewardRecords.length} new year reward records.`);
        }
    }

    @Cron('0 0 1 * *')
    async monthlyBirthdayReward() {
        Logger.log("Starting monthly birthday reward record creation...");
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);
        const currentMonthEnd = new Date(currentMonthStart);
        currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
        currentMonthEnd.setDate(0);
        currentMonthEnd.setHours(23, 59, 59, 999);

        const employees = await this.prisma.employees.findMany({
            where: {
                employeeid: {
                    not: 1
                },
                accounts: {
                    status: 'Active',
                    dob: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd
                    }
                },
            },
        });

        if (employees.length === 0) {
            Logger.log("No active employees with birthdays in the current month found, skipping monthly birthday reward record creation.");
            return;
        }

        const birthdayRule = await this.prisma.reward_rules.findFirst({
            where: {
                rewardname: 'Thưởng sinh nhật',
            }
        });

        if (!birthdayRule) {
            Logger.log("No holiday rule found or not valid, skipping monthly birthday reward record creation.");
            return;
        }

        const currentYearStart = new Date();
        currentYearStart.setMonth(0);
        currentYearStart.setDate(1);
        currentYearStart.setHours(0, 0, 0, 0);
        const currentYearEnd = new Date();
        currentYearEnd.setMonth(11);
        currentYearEnd.setDate(31);
        currentYearEnd.setHours(23, 59, 59, 999);


        const birthdayRewardRecords = await this.prisma.reward_records.findMany({
            where: {
                rewardruleid: birthdayRule.rewardruleid,
                rewarddate: {
                    gte: currentYearStart,
                    lte: currentYearEnd
                }
            },
            select: {
                employeeid: true,
            }
        });

        const rewardRecords: any[] = [];
        for (const employee of employees) {
            const hasReward = birthdayRewardRecords.some(record => record.employeeid === employee.employeeid);
            if (hasReward) {
                continue;
            } else {
                const finalRewardAmount = (Number(birthdayRule.rewardvalue || 0) + 1) * Number(employee.salary || 0);

                rewardRecords.push({
                    employeeid: employee.employeeid,
                    rewardruleid: birthdayRule.rewardruleid,
                    rewarddate: currentMonthStart,
                    rewardapplieddate: currentMonthStart,
                    rewardrecordstatus: 'pending',
                    rewardnote: `Thưởng sinh nhật tháng ${currentMonthStart.toLocaleDateString('vi-VN', { month: 'long' })}, ${currentMonthStart.getFullYear()}`,
                    finalrewardamount: finalRewardAmount,
                });
            }
        }

        if (rewardRecords.length > 0) {
            await this.prisma.reward_records.createMany({
                data: rewardRecords,
            });
            Logger.log(`Successfully created ${rewardRecords.length} monthly birthday reward records.`);
        }
    }
}